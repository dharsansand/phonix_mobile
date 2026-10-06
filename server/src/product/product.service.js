import { Injectable, NotFoundException, Dependencies } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';

const { Types } = mongoose;

@Injectable()
@Dependencies(getModelToken('Product'), getModelToken('Stock'))
export class ProductService {
  constructor(productModel, stockModel) {
    this.productModel = productModel;
    this.stockModel = stockModel;
  }

  async create(data) {
    // 1. Create and save the product
    const newProduct = new this.productModel(data);
    const savedProduct = await newProduct.save();

    // 2. Prepare stock records
    const stockEntries = [];

    // Case A: Product has variants (e.g., 'colour', 'size', etc.)
    if (savedProduct.variants && savedProduct.variants.length > 0) {
      for (const variant of savedProduct.variants) {
        // Only create stock if initial_stock is greater than 0
        if (variant.initial_stock > 0) {
          stockEntries.push({
            product: savedProduct._id,
            variantId: variant._id,
            quantity: Number(variant.initial_stock),
            type: 'initial',
            colour: variant.colour || '',
            size: variant.size || '',
            displaysize: variant.display_size || '',
            capacity: variant.capacity || '',
            category: savedProduct.category,
            price: Number(variant.price || 0),
            original_price: Number(variant.original_price || 0),
          });
        }
      }
    }
    // Case B: Basic product without variants
    else {
      if (savedProduct.initial_stock > 0) {
        stockEntries.push({
          product: savedProduct._id,
          variantId: null,
          quantity: Number(savedProduct.initial_stock),
          type: 'initial',
          colour: '',
          size: '',
          displaysize: '',
          capacity: '',
          category: savedProduct.category,
          price: Number(savedProduct.price || 0),
          original_price: Number(savedProduct.original_price || 0),
        });
      }
    }

    if (stockEntries.length > 0) {
      await this.stockModel.insertMany(stockEntries);
    }

    return savedProduct;
  }

  async findAll() {
    return await this.productModel
      .find({ isdelete: false })
      .sort({ createdAt: -1 });
  }

  async findHomeProductCategory() {
    return await this.stockModel.aggregate([
      // 1. Filter out deleted stock records
      {
        $match: {
          isdelete: false,
        },
      },

      // 2. Lookup the Product Document
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDoc',
        },
      },
      {
        $unwind: '$productDoc',
      },
      // Exclude deleted products
      {
        $match: {
          'productDoc.isdelete': false,
        },
      },

      // 3. Lookup Category Document
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDoc',
        },
      },
      {
        $unwind: '$categoryDoc',
      },

      // 4. Group by Product and assemble Variant Details with Stock & Unit
      {
        $group: {
          _id: '$product',
          name: { $first: '$productDoc.name' },
          producttype: { $first: '$productDoc.producttype' },
          unit: { $first: '$productDoc.unit' },
          categoryId: { $first: '$category' },
          categoryName: { $first: '$categoryDoc.name' },
          productSlug: { $first: '$productDoc.slug' },
          productImage: { $first: '$productDoc.productImage' },
          allDocVariants: { $first: '$productDoc.variants' },
          createdAt: {
            $first: {
              $ifNull: ['$productDoc.createdAt', '$createdAt'],
            },
          },

          stockList: {
            $push: {
              stockId: '$_id',
              variantId: '$variantId',
              colour: '$colour',
              capacity: '$capacity',
              size: '$size',
              displaysize: '$displaysize',
              price: '$price',
              original_price: '$original_price',
              quantity: '$quantity',
            },
          },
        },
      },

      // 5. 🟢 Robust Project: Match Product Variants with Stock variants
      {
        $project: {
          _id: 1,
          name: 1,
          producttype: 1,
          unit: 1,
          categoryId: 1,
          categoryName: 1,
          createdAt: 1,
          variants: {
            $cond: {
              if: { $eq: ['$producttype', 'basic'] },
              then: [
                {
                  stockId: { $arrayElemAt: ['$stockList.stockId', 0] },
                  variantId: null,
                  colour: '',
                  capacity: '',
                  size: '',
                  price: { $arrayElemAt: ['$stockList.price', 0] },
                  original_price: {
                    $arrayElemAt: ['$stockList.original_price', 0],
                  },
                  quantity: { $arrayElemAt: ['$stockList.quantity', 0] },
                  unit: '$unit',
                  slug: '$productSlug',
                  images: '$productImage',
                },
              ],
              else: {
                $map: {
                  input: '$stockList',
                  as: 'stk',
                  in: {
                    $let: {
                      vars: {
                        matchedVariant: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: { $ifNull: ['$allDocVariants', []] },
                                as: 'v',
                                cond: {
                                  $or: [
                                    // 1. Direct ID match
                                    { $eq: ['$$v._id', '$$stk.variantId'] },
                                    {
                                      $eq: [
                                        {
                                          $toString: {
                                            $ifNull: ['$$v._id', ''],
                                          },
                                        },
                                        {
                                          $toString: {
                                            $ifNull: ['$$stk.variantId', ''],
                                          },
                                        },
                                      ],
                                    },
                                    // 2. Case-insensitive Colour match
                                    {
                                      $and: [
                                        { $ne: ['$$stk.colour', ''] },
                                        {
                                          $eq: [
                                            { $toLower: '$$v.colour' },
                                            { $toLower: '$$stk.colour' },
                                          ],
                                        },
                                      ],
                                    },
                                    // 3. Match by Size if colour is empty
                                    {
                                      $and: [
                                        { $ne: ['$$stk.size', ''] },
                                        { $eq: ['$$v.size', '$$stk.size'] },
                                      ],
                                    },
                                  ],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: {
                        stockId: '$$stk.stockId',
                        variantId: '$$stk.variantId',
                        colour: '$$stk.colour',
                        colour_code: {
                          $ifNull: ['$$matchedVariant.colour_code', ''],
                        },
                        capacity: '$$stk.capacity',
                        size: '$$stk.size',
                        price: '$$stk.price',
                        original_price: '$$stk.original_price',
                        quantity: '$$stk.quantity',
                        unit: '$unit',
                        // 🟢 Always guarantees variant slug (falls back to productSlug)
                        slug: {
                          $ifNull: [
                            '$$matchedVariant.slug',
                            {
                              $concat: [
                                { $ifNull: ['$productSlug', 'product'] },
                                '-',
                                { $ifNull: ['$$stk.colour', 'variant'] },
                              ],
                            },
                          ],
                        },
                        // 🟢 Always guarantees images (falls back to productImage)
                        images: {
                          $cond: {
                            if: {
                              $gt: [
                                {
                                  $size: {
                                    $ifNull: ['$$matchedVariant.images', []],
                                  },
                                },
                                0,
                              ],
                            },
                            then: '$$matchedVariant.images',
                            else: {
                              $ifNull: ['$productImage', []],
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // 6. Sort latest products first
      {
        $sort: { createdAt: -1 },
      },

      // 7. Group by Category
      {
        $group: {
          _id: '$categoryId',
          categoryName: { $first: '$categoryName' },
          products: {
            $push: {
              _id: '$_id',
              name: '$name',
              producttype: '$producttype',
              unit: '$unit',
              variants: '$variants',
            },
          },
        },
      },

      // 8. Limit to maximum 5 products per category
      {
        $project: {
          _id: 1,
          categoryName: 1,
          products: { $slice: ['$products', 5] },
        },
      },
    ]);
  }

  async findMainProduct(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // 🟢 1. RESOLVE CATEGORY
    let targetCategoryId = null;

    if (query.category && query.category !== 'all') {
      const rawCat = String(query.category).trim();

      if (Types.ObjectId.isValid(rawCat) && rawCat.length === 24) {
        targetCategoryId = new Types.ObjectId(rawCat);
      } else {
        const searchRegex = new RegExp(
          rawCat.replace(/collection|essentials/gi, '').trim(),
          'i',
        );

        const foundCat = await this.stockModel.db
          .collection('categories')
          .findOne({
            name: { $regex: searchRegex },
            isdelete: false,
          });

        if (foundCat) {
          targetCategoryId = foundCat._id;
        }
      }
    }

    // 🟢 2. BASE MATCH FILTER
    const matchFilter = {
      isdelete: false,
    };

    if (targetCategoryId) {
      matchFilter.$or = [
        { category: targetCategoryId },
        { category: targetCategoryId.toString() },
      ];
    }

    // 🟢 3. AGGREGATION PIPELINE
    const pipeline = [
      { $match: matchFilter },

      // Lookup Product
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDoc',
        },
      },
      { $unwind: '$productDoc' },
      { $match: { 'productDoc.isdelete': false } },

      // Search Filter
      ...(query.search && String(query.search).trim()
        ? [
            {
              $match: {
                'productDoc.name': {
                  $regex: String(query.search).trim(),
                  $options: 'i',
                },
              },
            },
          ]
        : []),

      // Match category on productDoc
      ...(targetCategoryId
        ? [
            {
              $match: {
                $or: [
                  { category: targetCategoryId },
                  { category: targetCategoryId.toString() },
                  { 'productDoc.category': targetCategoryId },
                  { 'productDoc.category': targetCategoryId.toString() },
                ],
              },
            },
          ]
        : []),

      // Lookup Category
      {
        $lookup: {
          from: 'categories',
          localField: 'productDoc.category',
          foreignField: '_id',
          as: 'categoryDoc',
        },
      },
      {
        $unwind: {
          path: '$categoryDoc',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Group Product & Assemble Stock Variants
      {
        $group: {
          _id: '$product',
          name: { $first: '$productDoc.name' },
          producttype: { $first: '$productDoc.producttype' },
          unit: { $first: '$productDoc.unit' },
          categoryId: { $first: '$productDoc.category' },
          categoryName: { $first: '$categoryDoc.name' },
          productSlug: { $first: '$productDoc.slug' },
          productImage: { $first: '$productDoc.productImage' },
          allDocVariants: { $first: '$productDoc.variants' },
          createdAt: {
            $first: {
              $ifNull: ['$productDoc.createdAt', '$createdAt'],
            },
          },
          stockList: {
            $push: {
              stockId: '$_id',
              variantId: '$variantId',
              colour: '$colour',
              capacity: '$capacity',
              size: '$size',
              displaysize: '$displaysize',
              price: '$price',
              original_price: '$original_price',
              quantity: '$quantity',
            },
          },
        },
      },

      // 🟢 4. Robust Project Variants: Ensures `slug` and `images` are always returned
      // 🟢 4. Robust Project Variants: Matches even if IDs were regenerated
      {
        $project: {
          _id: 1,
          name: 1,
          producttype: 1,
          unit: 1,
          categoryId: 1,
          categoryName: 1,
          createdAt: 1,
          productImage: 1,
          variants: {
            $cond: {
              if: { $eq: ['$producttype', 'basic'] },
              then: [
                {
                  stockId: { $arrayElemAt: ['$stockList.stockId', 0] },
                  variantId: null,
                  colour: '',
                  capacity: '',
                  size: '',
                  price: { $arrayElemAt: ['$stockList.price', 0] },
                  original_price: {
                    $arrayElemAt: ['$stockList.original_price', 0],
                  },
                  quantity: { $arrayElemAt: ['$stockList.quantity', 0] },
                  unit: '$unit',
                  slug: '$productSlug',
                  images: '$productImage',
                },
              ],
              else: {
                $map: {
                  input: '$stockList',
                  as: 'stk',
                  in: {
                    $let: {
                      vars: {
                        matchedVariant: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: { $ifNull: ['$allDocVariants', []] },
                                as: 'v',
                                cond: {
                                  $or: [
                                    // 1. Direct ID match
                                    { $eq: ['$$v._id', '$$stk.variantId'] },
                                    {
                                      $eq: [
                                        {
                                          $toString: {
                                            $ifNull: ['$$v._id', ''],
                                          },
                                        },
                                        {
                                          $toString: {
                                            $ifNull: ['$$stk.variantId', ''],
                                          },
                                        },
                                      ],
                                    },
                                    // 2. Colour match (Handles 'Sage', 'Lavender' regardless of ID changes)
                                    {
                                      $and: [
                                        { $ne: ['$$stk.colour', ''] },
                                        {
                                          $eq: [
                                            { $toLower: '$$v.colour' },
                                            { $toLower: '$$stk.colour' },
                                          ],
                                        },
                                      ],
                                    },
                                    // 3. Match by Size if colour is empty
                                    {
                                      $and: [
                                        { $ne: ['$$stk.size', ''] },
                                        { $eq: ['$$v.size', '$$stk.size'] },
                                      ],
                                    },
                                  ],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: {
                        stockId: '$$stk.stockId',
                        variantId: '$$stk.variantId',
                        colour: '$$stk.colour',
                        colour_code: {
                          $ifNull: ['$$matchedVariant.colour_code', ''],
                        },
                        capacity: '$$stk.capacity',
                        size: '$$stk.size',
                        price: '$$stk.price',
                        original_price: '$$stk.original_price',
                        quantity: '$$stk.quantity',
                        unit: '$unit',
                        // 🟢 Always resolves variant slug
                        slug: {
                          $ifNull: [
                            '$$matchedVariant.slug',
                            {
                              $concat: [
                                { $ifNull: ['$productSlug', 'product'] },
                                '-',
                                { $ifNull: ['$$stk.colour', 'variant'] },
                              ],
                            },
                          ],
                        },
                        // 🟢 Always resolves images
                        images: {
                          $cond: {
                            if: {
                              $gt: [
                                {
                                  $size: {
                                    $ifNull: ['$$matchedVariant.images', []],
                                  },
                                },
                                0,
                              ],
                            },
                            then: '$$matchedVariant.images',
                            else: {
                              $ifNull: ['$productImage', []],
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // Add minimum price for sorting
      {
        $addFields: {
          minPrice: { $min: '$variants.price' },
        },
      },

      // Sorting: Newest first by default
      {
        $sort:
          query.sort === 'high-low'
            ? { minPrice: -1 }
            : query.sort === 'low-high'
              ? { minPrice: 1 }
              : { createdAt: -1 },
      },

      // Pagination Limit 10 & Count Total
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    const result = await this.stockModel.aggregate(pipeline);

    const total = result[0]?.metadata[0]?.total || 0;
    const products = result[0]?.data || [];

    // Safe Categories for Sidebar Filter
    let categories = [];
    try {
      categories = await this.stockModel.db
        .collection('categories')
        .find({ isdelete: false }, { projection: { _id: 1, name: 1 } })
        .toArray();
    } catch (e) {
      categories = [];
    }

    return {
      products,
      categories,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  // async findProductDetails(identifier) {
  //   if (!identifier) {
  //     throw new NotFoundException('Product identifier is required');
  //   }

  //   const cleanIdentifier = String(identifier).trim();

  //   // Check if input is a valid 24-character MongoDB ObjectId
  //   const isObjectId =
  //     Types.ObjectId.isValid(cleanIdentifier) && cleanIdentifier.length === 24;

  //   // 🟢 1. Search Query: Matches product _id, product slug, OR variant slug
  //   const productQuery = {
  //     isdelete: false,
  //     $or: [{ slug: cleanIdentifier }, { 'variants.slug': cleanIdentifier }],
  //   };

  //   if (isObjectId) {
  //     productQuery.$or.unshift({ _id: new Types.ObjectId(cleanIdentifier) });
  //   }

  //   // 🟢 2. Fetch Product & Populate Category
  //   const productDoc = await this.productModel
  //     .findOne(productQuery)
  //     .populate('category', 'name')
  //     .lean();

  //   if (!productDoc) {
  //     throw new NotFoundException(`Product not found for: ${cleanIdentifier}`);
  //   }

  //   const productId = productDoc._id;

  //   // 🟢 3. Fetch All Stocks for this Product
  //   const stockList = await this.stockModel
  //     .find({
  //       product: productId,
  //       isdelete: false,
  //     })
  //     .lean();

  //   // 🟢 4. Assemble Variants & Stocks based on Product Type
  //   let assembledVariants = [];

  //   if (productDoc.producttype === 'basic') {
  //     const basicStock = stockList[0] || {};
  //     assembledVariants = [
  //       {
  //         stockId: basicStock._id || null,
  //         variantId: null,
  //         colour: '',
  //         colour_code: '',
  //         capacity: '',
  //         size: '',
  //         price: basicStock.price ?? productDoc.price ?? 0,
  //         original_price:
  //           basicStock.original_price ?? productDoc.original_price ?? 0,
  //         quantity: basicStock.quantity ?? productDoc.initial_stock ?? 0,
  //         unit: productDoc.unit || 'no',
  //         slug: productDoc.slug,
  //         images: productDoc.productImage || [],
  //         content: productDoc.content || '',
  //         description: productDoc.description || '',
  //         meta_title: productDoc.meta_title || productDoc.name,
  //         meta_description: productDoc.meta_description || '',
  //         meta_keywords: productDoc.meta_keywords || '',
  //       },
  //     ];
  //   } else {
  //     // Variant Product: Map stock to corresponding variant definition
  //     const docVariants = productDoc.variants || [];

  //     assembledVariants = stockList.map((stk) => {
  //       // 🟢 Robust matching: By ID OR by case-insensitive Colour / Size
  //       const matched = docVariants.find((v) => {
  //         const idMatch =
  //           (v._id &&
  //             stk.variantId &&
  //             String(v._id) === String(stk.variantId)) ||
  //           (v.variantId &&
  //             stk.variantId &&
  //             String(v.variantId) === String(stk.variantId));

  //         const colourMatch =
  //           stk.colour &&
  //           v.colour &&
  //           String(v.colour).trim().toLowerCase() ===
  //             String(stk.colour).trim().toLowerCase();

  //         const sizeMatch =
  //           stk.size &&
  //           v.size &&
  //           String(v.size).trim().toLowerCase() ===
  //             String(stk.size).trim().toLowerCase();

  //         return idMatch || colourMatch || sizeMatch;
  //       });

  //       const variantImages =
  //         matched?.images && matched.images.length > 0
  //           ? matched.images
  //           : productDoc.productImage || [];

  //       return {
  //         stockId: stk._id,
  //         variantId: stk.variantId,
  //         colour: stk.colour || matched?.colour || '',
  //         colour_code: matched?.colour_code || '',
  //         capacity: stk.capacity || matched?.capacity || '',
  //         size: stk.size || matched?.size || '',
  //         displaysize: stk.displaysize || matched?.display_size || '',
  //         price: stk.price,
  //         original_price: stk.original_price,
  //         quantity: stk.quantity ?? 0,
  //         unit: productDoc.unit || 'no',
  //         slug: matched?.slug || productDoc.slug || '',
  //         images: variantImages,
  //         content: matched?.content || productDoc.content || '',
  //         description: matched?.description || productDoc.description || '',
  //         meta_title: matched?.meta_title || productDoc.meta_title || '',
  //         meta_description:
  //           matched?.meta_description || productDoc.meta_description || '',
  //         meta_keywords:
  //           matched?.meta_keywords || productDoc.meta_keywords || '',
  //       };
  //     });
  //   }

  //   // 🟢 5. Combine all unique images (Product + Variant images)
  //   const allImages = Array.from(
  //     new Set([
  //       ...(productDoc.productImage || []),
  //       ...assembledVariants.flatMap((v) => v.images || []),
  //     ]),
  //   ).filter(Boolean);

  //   // 🟢 6. Check if user opened page using a specific Variant Slug
  //   const matchedRequestedVariant = assembledVariants.find(
  //     (v) => v.slug && v.slug === cleanIdentifier,
  //   );

  //   // Default to matched variant if found, otherwise use first variant/stock
  //   const activeVariant = matchedRequestedVariant || assembledVariants[0] || {};
  //   const primaryStock = stockList[0] || {};

  //   // 🟢 7. Return Clean Product + Stock Payload
  //   return {
  //     product: {
  //       _id: productDoc._id,
  //       name: productDoc.name,
  //       producttype: productDoc.producttype,
  //       categoryId: productDoc.category?._id || productDoc.category,
  //       categoryName: productDoc.category?.name || 'VESSEL',
  //       unit: productDoc.unit || 'no',
  //       price:
  //         activeVariant.price ?? primaryStock.price ?? productDoc.price ?? 0,
  //       original_price:
  //         activeVariant.original_price ??
  //         primaryStock.original_price ??
  //         productDoc.original_price ??
  //         0,
  //       initial_stock:
  //         activeVariant.quantity ??
  //         primaryStock.quantity ??
  //         productDoc.initial_stock ??
  //         0,
  //       productImage: allImages,
  //       slug: productDoc.slug,

  //       // Variant-level fallback to product
  //       content: activeVariant.content || productDoc.content || '',
  //       description: activeVariant.description || productDoc.description || '',
  //       meta_title: activeVariant.meta_title || productDoc.meta_title || '',
  //       meta_description:
  //         activeVariant.meta_description || productDoc.meta_description || '',
  //       meta_keywords:
  //         activeVariant.meta_keywords || productDoc.meta_keywords || '',

  //       createdAt: productDoc.createdAt,
  //       updatedAt: productDoc.updatedAt,
  //       variants: assembledVariants,
  //     },
  //     stock: {
  //       _id: activeVariant.stockId || primaryStock._id,
  //       price:
  //         activeVariant.price ?? primaryStock.price ?? productDoc.price ?? 0,
  //       original_price:
  //         activeVariant.original_price ??
  //         primaryStock.original_price ??
  //         productDoc.original_price ??
  //         0,
  //       quantity:
  //         activeVariant.quantity ??
  //         primaryStock.quantity ??
  //         productDoc.initial_stock ??
  //         0,
  //       colour: activeVariant.colour || primaryStock.colour || '',
  //       capacity: activeVariant.capacity || primaryStock.capacity || '',
  //     },
  //   };
  // }
  async findProductDetails(identifier) {
    // This log will now work because the Controller is passing the ID correctly
    console.log('findProductDetails called with identifier:', identifier);

    if (!identifier) {
      throw new NotFoundException('Product identifier is required');
    }

    const cleanIdentifier = String(identifier).trim();

    const isObjectId =
      Types.ObjectId.isValid(cleanIdentifier) && cleanIdentifier.length === 24;

    // 1. Search Query
    const productQuery = {
      isdelete: false,
      $or: [{ slug: cleanIdentifier }, { 'variants.slug': cleanIdentifier }],
    };

    if (isObjectId) {
      productQuery.$or.unshift({ _id: new Types.ObjectId(cleanIdentifier) });
    }

    // 2. Fetch Product
    const productDoc = await this.productModel
      .findOne(productQuery)
      .populate('category', 'name')
      .lean();

    if (!productDoc) {
      throw new NotFoundException(`Product not found for: ${cleanIdentifier}`);
    }

    // 🟢 FIX: Ensure we get a clean ID for the category query
    // If populated, it's an object, so we take ._id. If not, it's already an ID.
    const currentCategoryId = productDoc.category?._id
      ? productDoc.category._id
      : productDoc.category;

    const productId = productDoc._id;
    console.log('Product ID:', productId);

    // 3. Fetch Stocks
    const stockList = await this.stockModel
      .find({
        product: productId,
        isdelete: false,
      })
      .lean();
    console.log('currentCategoryId', currentCategoryId);

    // 4. Assemble Variants
    let assembledVariants = [];
    if (productDoc.producttype === 'basic') {
      const basicStock = stockList[0] || {};
      assembledVariants = [
        {
          stockId: basicStock._id || null,
          variantId: null,
          colour: '',
          colour_code: '',
          capacity: '',
          size: '',
          price: basicStock.price ?? productDoc.price ?? 0,
          original_price:
            basicStock.original_price ?? productDoc.original_price ?? 0,
          quantity: basicStock.quantity ?? productDoc.initial_stock ?? 0,
          unit: productDoc.unit || 'no',
          slug: productDoc.slug,
          images: productDoc.productImage || [],
          content: productDoc.content || '',
          description: productDoc.description || '',
          meta_title: productDoc.meta_title || productDoc.name,
          meta_description: productDoc.meta_description || '',
          meta_keywords: productDoc.meta_keywords || '',
        },
      ];
    } else {
      const docVariants = productDoc.variants || [];
      assembledVariants = stockList.map((stk) => {
        const matched = docVariants.find((v) => {
          const idMatch =
            (v._id &&
              stk.variantId &&
              String(v._id) === String(stk.variantId)) ||
            (v.variantId &&
              stk.variantId &&
              String(v.variantId) === String(stk.variantId));
          const colourMatch =
            stk.colour &&
            v.colour &&
            String(stk.colour).trim().toLowerCase() ===
              String(v.colour).trim().toLowerCase();
          const sizeMatch =
            stk.size &&
            v.size &&
            String(stk.size).trim().toLowerCase() ===
              String(v.size).trim().toLowerCase();
          return idMatch || colourMatch || sizeMatch;
        });

        const variantImages =
          matched?.images && matched.images.length > 0
            ? matched.images
            : productDoc.productImage || [];

        return {
          stockId: stk._id,
          variantId: stk.variantId,
          colour: stk.colour || matched?.colour || '',
          colour_code: matched?.colour_code || '',
          capacity: stk.capacity || matched?.capacity || '',
          size: stk.size || matched?.size || '',
          displaysize: stk.displaysize || matched?.display_size || '',
          price: stk.price,
          original_price: stk.original_price,
          quantity: stk.quantity ?? 0,
          unit: productDoc.unit || 'no',
          slug: matched?.slug || productDoc.slug || '',
          images: variantImages,
          content: matched?.content || productDoc.content || '',
          description: matched?.description || productDoc.description || '',
          meta_title: matched?.meta_title || productDoc.meta_title || '',
          meta_description:
            matched?.meta_description || productDoc.meta_description || '',
          meta_keywords:
            matched?.meta_keywords || productDoc.meta_keywords || '',
        };
      });
    }

    // 5. Images
    const allImages = Array.from(
      new Set([
        ...(productDoc.productImage || []),
        ...assembledVariants.flatMap((v) => v.images || []),
      ]),
    ).filter(Boolean);

    // 6. Active Variant
    const matchedRequestedVariant = assembledVariants.find(
      (v) => v.slug && v.slug === cleanIdentifier,
    );
    const activeVariant = matchedRequestedVariant || assembledVariants[0] || {};
    const primaryStock = stockList[0] || {};

    // 7. FETCH RECENT PRODUCTS (SAME CATEGORY)
    const recentProductsRaw = await this.productModel
      .find({
        isdelete: false,
        category: currentCategoryId, // Uses the cleaned ID
        _id: { $ne: productId },
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log('Recent Products Raw:', recentProductsRaw);

    // 8. Map Recent Products (Fixes the Price: 0 and Empty Image issue)
    const recentProducts = recentProductsRaw.map((p) => {
      const displayPrice = p.price > 0 ? p.price : p.variants?.[0]?.price || 0;
      const displayOriginalPrice =
        p.original_price > 0
          ? p.original_price
          : p.variants?.[0]?.original_price || 0;
      const displayImage =
        p.productImage && p.productImage.length > 0
          ? p.productImage[0]
          : p.variants?.[0]?.images?.[0] || null;

      return {
        _id: p._id,
        name: p.name,
        slug: p.slug,
        price: displayPrice,
        original_price: displayOriginalPrice,
        image: displayImage,
      };
    });
    console.log('Recent Products:', recentProducts);

    // 9. Final Return
    return {
      product: {
        _id: productDoc._id,
        name: productDoc.name,
        producttype: productDoc.producttype,
        categoryId: currentCategoryId,
        categoryName: productDoc.category?.name || 'VESSEL',
        unit: productDoc.unit || 'no',
        price:
          activeVariant.price ?? primaryStock.price ?? productDoc.price ?? 0,
        original_price:
          activeVariant.original_price ??
          primaryStock.original_price ??
          productDoc.original_price ??
          0,
        initial_stock:
          activeVariant.quantity ??
          primaryStock.quantity ??
          productDoc.initial_stock ??
          0,
        productImage: allImages,
        slug: productDoc.slug,
        content: activeVariant.content || productDoc.content || '',
        description: activeVariant.description || productDoc.description || '',
        meta_title: activeVariant.meta_title || productDoc.meta_title || '',
        meta_description:
          activeVariant.meta_description || productDoc.meta_description || '',
        meta_keywords:
          activeVariant.meta_keywords || productDoc.meta_keywords || '',
        createdAt: productDoc.createdAt,
        updatedAt: productDoc.updatedAt,
        variants: assembledVariants,
      },
      stock: {
        _id: activeVariant.stockId || primaryStock._id,
        price:
          activeVariant.price ?? primaryStock.price ?? productDoc.price ?? 0,
        original_price:
          activeVariant.original_price ??
          primaryStock.original_price ??
          productDoc.original_price ??
          0,
        quantity:
          activeVariant.quantity ??
          primaryStock.quantity ??
          productDoc.initial_stock ??
          0,
        colour: activeVariant.colour || primaryStock.colour || '',
        capacity: activeVariant.capacity || primaryStock.capacity || '',
      },
      recentProducts: recentProducts,
    };
  }

  async findOne(id) {
    const banner = await this.productModel.findOne({
      _id: id,
      isdelete: false,
    });
    if (!banner) {
      throw new NotFoundException('product not found');
    }
    return banner;
  }

  async update(id, updateData) {
    const updated = await this.productModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException('product not found');
    }
    return updated;
  }

  async delete(id) {
    const deleted = await this.productModel.findByIdAndUpdate(
      id,
      { isdelete: true },
      { new: true },
    );
    if (!deleted) {
      throw new NotFoundException('product not found');
    }
    return { message: 'product deleted successfully' };
  }

  async toggleActive(id, Active) {
    const updated = await this.productModel.findByIdAndUpdate(
      id,
      { Active },
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('product not found');
    }
    return updated;
  }
}
