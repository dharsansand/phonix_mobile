"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiHeart,
  HiMinus,
  HiPlus,
  HiChevronRight,
  HiChevronLeft,
  HiShieldCheck,
  HiTruck,
  HiRefresh,
  HiShare,
  HiHome,
} from "react-icons/hi";
import styles from "./productDetail.module.css";
import { useGetProductdetailsQuery } from "../../../store/api/productApi";
import { useAddToCartMutation } from "../../../store/api/cartApi";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../../../store/api/wishlistApi";

export default function ProductDetailClient({
  initialProduct,
  identifier: propId,
}) {
  const params = useParams();
  const router = useRouter();
  const identifier = decodeURIComponent(params.id || propId || "");

  const [isSharing, setIsSharing] = useState(false);

  // RTK Query hook
  const { data: response, isLoading } = useGetProductdetailsQuery(identifier, {
    skip: !identifier,
  });

  const [addToCartApi] = useAddToCartMutation();
  const [toggleWishlistApi] = useToggleWishlistMutation();

  const product = response?.product || response || initialProduct || {};
  const stock = response?.stock || response?.stockDetails || {};
  const variants =
    product.variants && product.variants.length > 0 ? product.variants : [];

  // 🟢 EXTRACT RECENT PRODUCTS FROM API
  const recentProducts = response?.recentProducts || [];

  // Component States
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Customer detection
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

  // Fetch Wishlist from DB if customer is logged in
  const { data: dbWishlistResponse = {} } = useGetWishlistQuery(customerId, {
    skip: !customerId,
  });

  const dbWishlistItems =
    dbWishlistResponse?.items || dbWishlistResponse?.wishlist?.items || [];

  // Sync active variant with URL slug
  useEffect(() => {
    if (variants.length > 0) {
      const matchIdx = variants.findIndex(
        (v) => v.slug?.toLowerCase() === identifier.toLowerCase(),
      );
      if (matchIdx !== -1) {
        setSelectedVariantIdx(matchIdx);
      }
    }
  }, [identifier, variants]);

  const currentVariant = variants[selectedVariantIdx] || {};

  // Check if wishlisted
  useEffect(() => {
    if (!product._id) return;

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
        const existingWishlist = JSON.parse(
          localStorage.getItem("wishlistItems") || "[]",
        );
        const existsLocally = existingWishlist.some(
          (item) =>
            item.productId === product._id &&
            (!currentVariant.stockId ||
              item.stockId === currentVariant.stockId),
        );
        setIsWishlisted(existsLocally);
      } catch (e) {
        setIsWishlisted(false);
      }
    }
  }, [customerId, dbWishlistItems, product._id, currentVariant.stockId]);

  // Images for current variant
  const images = useMemo(() => {
    const variantImgs = currentVariant.images?.filter(Boolean) || [];
    if (variantImgs.length > 0) return variantImgs;

    const productImgs = product.productImage?.filter(Boolean) || [];
    if (productImgs.length > 0) return productImgs;

    return [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&auto=format&fit=crop&q=80",
    ];
  }, [currentVariant, product]);

  const handleVariantChange = (idx) => {
    setSelectedVariantIdx(idx);
    setSelectedImgIdx(0);
    setQty(1);

    const newSlug = variants[idx]?.slug;
    if (newSlug) {
      window.history.replaceState(null, "", `/product/${newSlug}`);
    }
  };

  // Pricing & Stock
  const currentPrice =
    currentVariant.price || stock.price || product.price || 0;
  const currentOriginalPrice =
    currentVariant.original_price ||
    stock.original_price ||
    product.original_price;
  const currentStock =
    currentVariant.quantity ?? stock.quantity ?? product.initial_stock ?? 0;
  const unitLabel = currentVariant.unit || product.unit || "item";
  const isOutOfStock = currentStock <= 0;

  const activeContent = currentVariant.content || product.content || "";
  const activeDescription =
    currentVariant.description || product.description || "";

  // Carousel controls
  const nextImage = () =>
    setSelectedImgIdx((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setSelectedImgIdx((prev) => (prev - 1 + images.length) % images.length);

  const handleQtyChange = (delta) => {
    setQty((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > currentStock) return currentStock;
      return next;
    });
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    const cartPayload = {
      productId: product._id,
      stockId: currentVariant.stockId || stock._id,
      name: product.name,
      variantId: currentVariant.variantId || currentVariant._id || null,
      colour: currentVariant.colour || stock.colour || "",
      capacity: currentVariant.capacity || stock.capacity || "",
      unit: unitLabel,
      image: images[selectedImgIdx] || images[0],
      price: Number(currentPrice),
      totalPrice: Number(currentPrice * qty),
      quantity: Number(qty),
      slug: currentVariant.slug || product.slug || product._id,
    };

    if (customerId) {
      try {
        await addToCartApi({ customerId, ...cartPayload }).unwrap();
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    } else {
      try {
        const existingCart = JSON.parse(
          localStorage.getItem("cartItems") || "[]",
        );
        const idx = existingCart.findIndex(
          (item) =>
            item.productId === cartPayload.productId &&
            item.stockId === cartPayload.stockId,
        );

        if (idx > -1) {
          existingCart[idx].quantity += qty;
          existingCart[idx].totalPrice += cartPayload.totalPrice;
        } else {
          existingCart.push(cartPayload);
        }

        localStorage.setItem("cartItems", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (e) {
        console.error("Cart storage error:", e);
      }
    }

    router.push("/cart");
  };

  // Handle Toggle Wishlist
  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
      productId: product._id,
      stockId: currentVariant.stockId || stock._id,
      name: product.name,
      variantId: currentVariant.variantId || currentVariant._id || null,
      colour: currentVariant.colour || stock.colour || "",
      capacity: currentVariant.capacity || stock.capacity || "",
      image: images[selectedImgIdx] || images[0],
      price: Number(currentPrice),
      original_price: currentOriginalPrice
        ? Number(currentOriginalPrice)
        : null,
      slug: currentVariant.slug || product.slug || product._id,
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

  if (isLoading && !product.name) {
    return (
      <div className={styles.centerBox}>
        <div className={styles.shimmerLoader} />
        <p>Loading Phonix Mobile Product...</p>
      </div>
    );
  }

  if (!product.name) {
    return (
      <div className={styles.centerBox}>
        <h2>Product Not Found</h2>
        <p>We couldn&apos;t retrieve the requested product or spare part.</p>
        <Link href="/product" className={styles.primaryBtn}>
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.breadcrumb}>
        <Link href="/">
          <HiHome size={14} /> Home
        </Link>
        <HiChevronRight size={13} />
        <Link href="/product">Products</Link>
        <HiChevronRight size={13} />
        <span className={styles.activeBreadcrumb}>{product.name}</span>
      </nav>

      <div className={styles.productGrid}>
        <div className={styles.galleryArea}>
          <div className={styles.mainImageCard}>
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

            <div className={styles.imageWrapper}>
              <img
                src={images[selectedImgIdx] || images[0]}
                alt={`${product.name} - ${currentVariant.colour || ""}`}
                className={styles.mainImage}
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className={`${styles.navArrow} ${styles.prevArrow}`}
                  aria-label="Previous Image"
                >
                  <HiChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className={`${styles.navArrow} ${styles.nextArrow}`}
                  aria-label="Next Image"
                >
                  <HiChevronRight size={22} />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className={styles.carouselDots}>
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`${styles.dot} ${
                      selectedImgIdx === idx ? styles.activeDot : ""
                    }`}
                    onClick={() => setSelectedImgIdx(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbTrack}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`${styles.thumbBtn} ${
                    selectedImgIdx === idx ? styles.activeThumb : ""
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.infoArea}>
          <div className={styles.headerMeta}>
            {activeContent && (
              <span className={styles.materialTag}>{activeContent}</span>
            )}
            <button
              type="button"
              disabled={isSharing}
              className={styles.shareBtn}
              onClick={async () => {
                if (isSharing) return;
                const targetSlug =
                  currentVariant.slug || product.slug || identifier;
                const shareUrl = `${window.location.origin}/product/${targetSlug}`;
                const shareTitle = currentVariant.meta_title || product.name;
                const isMobile =
                  typeof navigator !== "undefined" &&
                  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                setIsSharing(true);
                try {
                  if (isMobile && navigator.share) {
                    await navigator.share({
                      title: shareTitle,
                      text: `Check out ${product.name} on Phonix Mobile!`,
                      url: shareUrl,
                    });
                  } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(shareUrl);
                  }
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsSharing(false);
                }
              }}
              aria-label="Share product"
            >
              <HiShare size={18} />
            </button>
          </div>

          <h1 className={styles.productTitle}>{product.name}</h1>

          <div className={styles.priceRow}>
            <span className={styles.currentPrice}>
              ₹{(currentPrice * qty).toLocaleString("en-IN")}
            </span>
            {currentOriginalPrice && (
              <span className={styles.originalPrice}>
                ₹{(currentOriginalPrice * qty).toLocaleString("en-IN")}
              </span>
            )}
            {currentOriginalPrice && currentOriginalPrice > currentPrice && (
              <span className={styles.discountBadge}>
                {Math.round(
                  ((currentOriginalPrice - currentPrice) /
                    currentOriginalPrice) *
                    100,
                )}
                % OFF
              </span>
            )}
          </div>

          {variants.length > 1 && (
            <div className={styles.sectionBlock}>
              <label className={styles.blockLabel}>Choose Option:</label>
              <div className={styles.variantList}>
                {variants.map((v, idx) => {
                  const isActive = selectedVariantIdx === idx;
                  return (
                    <button
                      key={v.stockId || v.variantId || idx}
                      type="button"
                      onClick={() => handleVariantChange(idx)}
                      className={`${styles.variantPill} ${isActive ? styles.activeVariantPill : ""}`}
                    >
                      {v.colour_code && (
                        <span
                          style={{
                            display: "inline-block",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: v.colour_code,
                            marginRight: "6px",
                            border: "1px solid rgba(255,255,255,0.4)",
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
          )}

          <div className={styles.sectionBlock}>
            <label className={styles.blockLabel}>Select Quantity:</label>
            <div className={styles.qtyBox}>
              <button
                type="button"
                onClick={() => handleQtyChange(-1)}
                disabled={isOutOfStock || qty <= 1}
                className={styles.qtyBtn}
              >
                <HiMinus size={14} />
              </button>
              <span className={styles.qtyVal}>
                <strong>{qty}</strong> {unitLabel}
              </span>
              <button
                type="button"
                onClick={() => handleQtyChange(1)}
                disabled={isOutOfStock || qty >= currentStock}
                className={styles.qtyBtn}
              >
                <HiPlus size={14} />
              </button>
            </div>
          </div>

          <div className={styles.desktopActionRow}>
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={styles.addToCartBtn}
            >
              <HiOutlineShoppingBag size={20} />
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </button>

            <button
              type="button"
              onClick={handleWishlistToggle}
              className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ""}`}
            >
              {isWishlisted ? (
                <HiHeart size={22} color="#ef4444" />
              ) : (
                <HiOutlineHeart size={22} />
              )}
            </button>
          </div>

          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <HiShieldCheck size={22} className={styles.trustIcon} />
              <div>
                <h4>100% Tested Genuine Quality</h4>
                <p>Original specifications certified.</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <HiTruck size={22} className={styles.trustIcon} />
              <div>
                <h4>Express Dispatch</h4>
                <p>Direct from Phonix Mobile workshop.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeDescription && (
        <section className={styles.descriptionSection}>
          <div className={styles.descHeader}>
            <span className={styles.descTag} />
            <h2 className={styles.descTitle}>Specifications & Overview</h2>
          </div>
          <div className={styles.descCard}>
            <div
              className={styles.htmlContent}
              dangerouslySetInnerHTML={{ __html: activeDescription }}
            />
          </div>
        </section>
      )}

      {/* 🟢 RECENT PRODUCTS SECTION (NEW) */}
      {recentProducts.length > 0 && (
        <section className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>You May Also Like</h2>
            <div className={styles.divider} />
          </div>
          <div className={styles.recentScrollContainer}>
            {recentProducts.map((item) => (
              <Link
                key={item._id}
                href={`/product/${item.slug || item._id}`}
                className={styles.recentCard}
              >
                <div className={styles.recentImageWrapper}>
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className={styles.recentImage}
                  />
                </div>
                <div className={styles.recentInfo}>
                  <h3 className={styles.recentName}>{item.name}</h3>
                  <div className={styles.recentPriceRow}>
                    <span className={styles.recentPrice}>
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    {item.original_price > item.price && (
                      <span className={styles.recentOldPrice}>
                        ₹{item.original_price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className={styles.mobileBottomBar}>
        <div className={styles.mobilePriceBox}>
          <span className={styles.mobilePriceLabel}>Total</span>
          <span className={styles.mobilePrice}>
            ₹{(currentPrice * qty).toLocaleString("en-IN")}
          </span>
        </div>
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={styles.mobileCartBtn}
        >
          <HiOutlineShoppingBag size={18} />
          <span>{isOutOfStock ? "Sold Out" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}
