"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingBag,
  HiMinus,
  HiPlus,
  HiOutlineAdjustments,
  HiOutlineSearch,
  HiChevronLeft,
  HiChevronRight,
  HiHome,
} from "react-icons/hi";
import styles from "./productPage.module.css";
import { useGetMainProductQuery } from "../../store/api/productApi";
import { useAddToCartMutation } from "../../store/api/cartApi";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../../store/api/wishlistApi";

function ProductCard({ product, categoryName, customerId, dbWishlistItems }) {
  const router = useRouter();
  const [addToCartApi] = useAddToCartMutation();
  const [toggleWishlistApi] = useToggleWishlistMutation();

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const variants = product.variants || [];
  const currentVariant = variants[selectedVariantIdx] || {};

  const unitLabel = currentVariant.unit || product.unit || "item";
  const currentStock = currentVariant.quantity ?? 0;
  const isOutOfStock = currentStock <= 0;

  const currentImage =
    currentVariant.images?.[0] ||
    product.productImage?.[0] ||
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80";

  const targetSlug =
    currentVariant.slug && String(currentVariant.slug).trim() !== ""
      ? currentVariant.slug
      : product.slug && String(product.slug).trim() !== ""
        ? product.slug
        : product._id;

  const productUrl = `/product/${targetSlug}`;

  useEffect(() => {
    if (customerId && Array.isArray(dbWishlistItems)) {
      const existsInDb = dbWishlistItems.some(
        (it) =>
          String(it.productId) === String(product._id) &&
          (!currentVariant.stockId ||
            String(it.stockId) === String(currentVariant.stockId)),
      );
      setIsWishlisted(existsInDb);
    } else {
      try {
        const localList = JSON.parse(
          localStorage.getItem("wishlistItems") || "[]",
        );
        const existsLocally = localList.some(
          (it) =>
            it.productId === product._id &&
            (!currentVariant.stockId || it.stockId === currentVariant.stockId),
        );
        setIsWishlisted(existsLocally);
      } catch (e) {
        setIsWishlisted(false);
      }
    }
  }, [customerId, dbWishlistItems, product._id, currentVariant.stockId]);

  const handleQtyChange = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setQty((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > currentStock) return currentStock;
      return next;
    });
  };

  const totalPrice = (currentVariant.price || product.price || 0) * qty;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const cartPayload = {
      productId: product._id,
      stockId: currentVariant.stockId,
      name: product.name,
      variantId: currentVariant.variantId || null,
      colour: currentVariant.colour || "",
      capacity: currentVariant.capacity || "",
      unit: unitLabel,
      image: currentImage,
      price: Number(currentVariant.price || product.price),
      totalPrice: Number(totalPrice),
      quantity: Number(qty),
      slug: targetSlug,
    };

    if (customerId) {
      try {
        await addToCartApi({ customerId, ...cartPayload }).unwrap();
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        console.error("Failed to add to database cart:", error);
      }
    } else {
      try {
        const existingCart = JSON.parse(
          localStorage.getItem("cartItems") || "[]",
        );
        const existingIndex = existingCart.findIndex(
          (item) =>
            item.productId === cartPayload.productId &&
            item.stockId === cartPayload.stockId,
        );

        if (existingIndex > -1) {
          existingCart[existingIndex].quantity += qty;
          existingCart[existingIndex].totalPrice += totalPrice;
        } else {
          existingCart.push(cartPayload);
        }

        localStorage.setItem("cartItems", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error("Cart storage error", err);
      }
    }

    router.push("/cart");
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
      productId: product._id,
      stockId: currentVariant.stockId,
      name: product.name,
      variantId: currentVariant.variantId || null,
      colour: currentVariant.colour || "",
      capacity: currentVariant.capacity || "",
      image: currentImage,
      price: Number(currentVariant.price || product.price),
      original_price:
        currentVariant.original_price || product.original_price
          ? Number(currentVariant.original_price || product.original_price)
          : null,
      slug: targetSlug,
    };

    if (customerId) {
      try {
        const res = await toggleWishlistApi({
          customerId,
          ...wishlistItem,
        }).unwrap();
        setIsWishlisted(res.isAdded ?? !isWishlisted);
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (err) {
        console.error("Failed to toggle wishlist in DB:", err);
      }
    } else {
      try {
        let existingWishlist = JSON.parse(
          localStorage.getItem("wishlistItems") || "[]",
        );
        const existsIdx = existingWishlist.findIndex(
          (item) =>
            item.productId === wishlistItem.productId &&
            item.stockId === wishlistItem.stockId,
        );

        if (existsIdx > -1) {
          existingWishlist.splice(existsIdx, 1);
          setIsWishlisted(false);
        } else {
          existingWishlist.push(wishlistItem);
          setIsWishlisted(true);
        }

        localStorage.setItem("wishlistItems", JSON.stringify(existingWishlist));
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (err) {
        console.error("Wishlist toggle error", err);
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span
          className={
            isOutOfStock
              ? styles.outOfStockBadge
              : currentStock < 10
                ? styles.lowStockBadge
                : styles.inStockBadge
          }
        >
          {isOutOfStock
            ? "OUT OF STOCK"
            : currentStock < 10
              ? `ONLY ${currentStock} LEFT`
              : "IN STOCK"}
        </span>

        <button
          type="button"
          className={styles.wishBtn}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          onClick={handleWishlistToggle}
        >
          {isWishlisted ? (
            <HiHeart size={18} color="#ef4444" />
          ) : (
            <HiOutlineHeart size={18} />
          )}
        </button>
      </div>

      <Link href={productUrl} className={styles.imgLink}>
        <div className={styles.imgStage}>
          <img
            src={currentImage}
            alt={product.name}
            className={styles.productImg}
          />
        </div>
      </Link>

      <div className={styles.cardBody}>
        <span className={styles.categoryLabel}>
          {categoryName || "ACCESSORY"}
        </span>

        <h3 className={styles.productTitle}>
          <Link href={productUrl}>{product.name}</Link>
        </h3>

        {/* Variant Selector Pills */}
        {variants.length > 1 ? (
          <div className={styles.variantBox}>
            <span className={styles.variantLabel}>Select Option:</span>
            <div className={styles.variantList}>
              {variants.map((v, idx) => {
                const isActive = selectedVariantIdx === idx;
                return (
                  <button
                    key={v.stockId || idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariantIdx(idx);
                      setQty(1);
                    }}
                    className={`${styles.varPill} ${
                      isActive ? styles.activeVarPill : ""
                    }`}
                  >
                    {v.colour_code && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          backgroundColor: v.colour_code,
                          marginRight: "5px",
                          border: "1px solid rgba(255,255,255,0.3)",
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                    <span>
                      {v.colour} {v.capacity ? `(${v.capacity})` : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={styles.specBadges}>
            <span>Original Tested</span>
            <span>&bull;</span>
            <span>Fast Dispatch</span>
          </div>
        )}

        {/* Quantity Controller */}
        <div className={styles.unitRow}>
          <span className={styles.qtyLabel}>Quantity:</span>
          <div className={styles.qtyBox}>
            <button
              type="button"
              onClick={(e) => handleQtyChange(e, -1)}
              disabled={isOutOfStock || qty <= 1}
              className={styles.qtyBtn}
            >
              <HiMinus size={12} />
            </button>
            <span className={styles.qtyVal}>
              <strong>{qty}</strong> {unitLabel}
            </span>
            <button
              type="button"
              onClick={(e) => handleQtyChange(e, 1)}
              disabled={isOutOfStock || qty >= currentStock}
              className={styles.qtyBtn}
            >
              <HiPlus size={12} />
            </button>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className={styles.cardFooter}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
            {(currentVariant.original_price || product.original_price) && (
              <span className={styles.strikePrice}>
                ₹
                {(
                  (currentVariant.original_price || product.original_price) *
                  qty
                ).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <button
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={styles.addBtn}
          >
            <HiOutlineShoppingBag size={17} />
            <span>{isOutOfStock ? "Sold" : "Add"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 🟢 Main Catalogue Content (Preserved 100% functionality)
export default function ProductCatalogueClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category") || "all";
  const urlSearch = searchParams.get("search") || "";

  const [selectedCat, setSelectedCat] = useState(urlCategory);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      setCurrentUser(user);
    } catch (e) {
      setCurrentUser(null);
    }
  }, []);

  const customerId = currentUser?.id || currentUser?._id;

  const { data: dbWishlistResponse = {} } = useGetWishlistQuery(customerId, {
    skip: !customerId,
  });

  const dbWishlistItems =
    dbWishlistResponse?.items || dbWishlistResponse?.wishlist?.items || [];

  useEffect(() => {
    setSelectedCat(urlCategory);
    setCurrentPage(1);
  }, [urlCategory]);

  useEffect(() => {
    setSearchQuery(urlSearch);
    setCurrentPage(1);
  }, [urlSearch]);

  const { data: response = {}, isLoading } = useGetMainProductQuery({
    search: searchQuery,
    category: selectedCat !== "all" ? selectedCat : undefined,
    sort: sortBy,
    page: currentPage,
    limit,
  });

  const products = response.products || [];
  const categories = response.categories || [];
  const totalPages = response.totalPages || 1;

  const handleCategorySelect = (catName) => {
    setSelectedCat(catName);
    setCurrentPage(1);

    if (catName && catName !== "all") {
      router.push(`/product?category=${encodeURIComponent(catName)}`);
    } else {
      router.push(`/product`);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">
              <HiHome size={14} /> Home
            </Link>
            <span>/</span>
            <span className={styles.activeCrumb}>Products</span>
          </div>
          <span className={styles.heroBadge}>
            AUTHENTIC ACCESSORIES & SPARES
          </span>
          <h1 className={styles.heroTitle}>Smartphone Gear & Spares</h1>
          <p className={styles.heroSub}>
            Premium GaN fast chargers, armor cases, 9H tempered glass, and
            tested OEM components in Tirupur.
          </p>
        </div>
      </section>

      {/* CATALOGUE MAIN LAYOUT */}
      <div className={styles.catalogueLayout}>
        {/* LEFT SIDEBAR FILTERS */}
        <aside className={styles.filterSidebar}>
          <div className={styles.sidebarHeader}>
            <HiOutlineAdjustments size={20} className={styles.cyanIcon} />
            <h3>Filters</h3>
          </div>

          <div className={styles.searchBox}>
            <HiOutlineSearch size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search accessories & parts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.sortSelect}
              style={{ width: "100%", marginTop: "0.25rem" }}
            >
              <option value="newest">Newest Added</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Categories</h4>
            <div className={styles.radioList}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCat === "all"}
                  onChange={() => handleCategorySelect("all")}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>All Products</span>
              </label>

              {categories.map((cat) => {
                const isChecked =
                  selectedCat?.toLowerCase() === cat.name?.toLowerCase() ||
                  selectedCat === cat._id;

                return (
                  <label key={cat._id} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="category"
                      checked={isChecked}
                      onChange={() => handleCategorySelect(cat.name)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioText}>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCat("all");
              setSearchQuery("");
              setSortBy("newest");
              setCurrentPage(1);
              router.push("/product");
            }}
            className={styles.resetBtn}
          >
            Reset Filters
          </button>
        </aside>

        {/* RIGHT PRODUCTS MAIN AREA */}
        <div className={styles.productsMainArea}>
          {isLoading ? (
            <div className={styles.loadingBox}>Loading Products...</div>
          ) : products.length === 0 ? (
            <div className={styles.emptyBox}>
              <h3>No products found</h3>
              <p>
                Try adjusting your search query or choosing another category.
              </p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  categoryName={product.categoryName}
                  customerId={customerId}
                  dbWishlistItems={dbWishlistItems}
                />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className={styles.paginationRow}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={styles.pageBtn}
              >
                <HiChevronLeft size={18} /> Prev
              </button>

              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`${styles.pageNumBtn} ${
                      currentPage === i + 1 ? styles.pageNumActive : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={styles.pageBtn}
              >
                Next <HiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
