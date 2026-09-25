"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiArrowRight,
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingBag,
  HiChevronLeft,
  HiChevronRight,
  HiMinus,
  HiPlus,
} from "react-icons/hi";
import styles from "./style/ProductSection.module.css";
import { useGetHomeproductCategoryQuery } from "../store/api/productApi";
import { useAddToCartMutation } from "../store/api/cartApi";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../store/api/wishlistApi";

// 🟢 Single Product Card Component
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
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80";

  const productSlug = currentVariant.slug || product.slug || product._id;
  const productUrl = `/product/${productSlug}`;

  // Check wishlist state
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
        const localWishlist = JSON.parse(
          localStorage.getItem("wishlistItems") || "[]",
        );
        const existsLocally = localWishlist.some(
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

  const totalPrice = (currentVariant.price || 0) * qty;

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
      price: Number(currentVariant.price),
      totalPrice: Number(totalPrice),
      quantity: Number(qty),
      slug: productSlug,
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
      price: Number(currentVariant.price),
      original_price: currentVariant.original_price
        ? Number(currentVariant.original_price)
        : null,
      slug: productSlug,
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
    <div className={styles.productCard}>
      {/* Top Bar: Stock Status & Wishlist */}
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
            <HiHeart size={19} color="#ef4444" />
          ) : (
            <HiOutlineHeart size={19} />
          )}
        </button>
      </div>

      {/* Image Container */}
      <Link href={productUrl} className={styles.imageStageLink}>
        <div className={styles.imageStage}>
          <div className={styles.ambientReflection} />
          <img
            src={currentImage}
            alt={product.name}
            className={styles.productImg}
          />
        </div>
      </Link>

      {/* Card Body */}
      <div className={styles.cardBody}>
        <span className={styles.categoryTag}>
          {categoryName || "ACCESSORY"}
        </span>

        <h3 className={styles.productTitle}>
          <Link href={productUrl}>{product.name}</Link>
        </h3>

        {/* Variants Selector */}
        {variants.length > 1 ? (
          <div className={styles.variantSelector}>
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
                    className={`${styles.variantPill} ${
                      isActive ? styles.activeVariantPill : ""
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
        ) : (
          <div className={styles.specBadges}>
            <span>{currentVariant.capacity || "Original Quality"}</span>
            <span>&bull;</span>
            <span>Tested & Certified</span>
          </div>
        )}

        {/* Quantity Controller */}
        <div className={styles.unitControlRow}>
          <span className={styles.qtyLabel}>Quantity:</span>

          <div className={styles.qtyCounterBox}>
            <button
              type="button"
              onClick={(e) => handleQtyChange(e, -1)}
              disabled={isOutOfStock || qty <= 1}
              className={styles.qtyBtn}
              aria-label="Decrease quantity"
            >
              <HiMinus size={13} />
            </button>

            <span className={styles.qtyText}>
              <strong>{qty}</strong> {unitLabel}
            </span>

            <button
              type="button"
              onClick={(e) => handleQtyChange(e, 1)}
              disabled={isOutOfStock || qty >= currentStock}
              className={styles.qtyBtn}
              aria-label="Increase quantity"
            >
              <HiPlus size={13} />
            </button>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className={styles.cardBottom}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
            {currentVariant.original_price && (
              <span className={styles.oldPrice}>
                ₹{(currentVariant.original_price * qty).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <button
            disabled={isOutOfStock}
            className={styles.cartActionBtn}
            aria-label="Add to cart"
            onClick={handleAddToCart}
          >
            <HiOutlineShoppingBag size={17} />
            <span>{isOutOfStock ? "Sold" : "Add"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 🟢 Main Section Component
export default function ProductSection() {
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

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

  const { data: productsData = [], isLoading } =
    useGetHomeproductCategoryQuery();

  const categoryTabs = useMemo(() => {
    const tabs = [{ id: "all", name: "All Products" }];
    if (Array.isArray(productsData)) {
      productsData.forEach((cat) => {
        if (cat.categoryName) {
          tabs.push({ id: cat._id, name: cat.categoryName });
        }
      });
    }
    return tabs;
  }, [productsData]);

  const displayProducts = useMemo(() => {
    if (!Array.isArray(productsData)) return [];

    if (activeCategoryId === "all") {
      const allList = [];
      productsData.forEach((cat) => {
        cat.products?.forEach((prod) => {
          allList.push({ ...prod, categoryName: cat.categoryName });
        });
      });
      return allList;
    }

    const selectedCat = productsData.find(
      (cat) => cat._id === activeCategoryId,
    );
    if (!selectedCat) return [];
    return (selectedCat.products || []).map((prod) => ({
      ...prod,
      categoryName: selectedCat.categoryName,
    }));
  }, [productsData, activeCategoryId]);

  const handleScroll = useCallback((direction) => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.firstChild?.offsetWidth || 310;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;

    if (direction === "right") {
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        trackRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else {
      if (scrollLeft <= 10) {
        trackRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        trackRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    if (isPaused || displayProducts.length <= 4) return;

    const timer = setInterval(() => {
      handleScroll("right");
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, displayProducts.length, handleScroll]);

  if (isLoading) {
    return (
      <section className={styles.sectionWrapper}>
        <div
          className={styles.container}
          style={{ textAlign: "center", padding: "4rem 0" }}
        >
          <p style={{ color: "#00d2ff", fontWeight: 700 }}>
            Loading Phonix Mobile Products & Spares...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.container}>
        {/* HEADER AREA */}
        <div className={styles.headerBlock}>
          <div className={styles.titleInfo}>
            <span className={styles.tagLine}>
              <span className={styles.pulseDot} /> AUTHENTIC GEAR & SPARES
            </span>
            <h2 className={styles.mainHeading}>
              Smartphone Accessories & Spares
            </h2>
          </div>

          {/* DYNAMIC CATEGORY TABS */}
          <div className={styles.navBar}>
            <div className={styles.categoryTrack}>
              {categoryTabs.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`${styles.categoryTab} ${
                    activeCategoryId === cat.id ? styles.activeTab : ""
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Left / Right Controls */}
            <div className={styles.arrowControls}>
              <button
                onClick={() => handleScroll("left")}
                className={styles.arrowBtn}
                aria-label="Scroll left"
              >
                <HiChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className={styles.arrowBtn}
                aria-label="Scroll right"
              >
                <HiChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* HORIZONTAL CAROUSEL */}
        <div
          className={styles.carouselContainer}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div ref={trackRef} className={styles.horizontalTrack}>
            {displayProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                categoryName={product.categoryName}
                customerId={customerId}
                dbWishlistItems={dbWishlistItems}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM WORKSHOP SPARES BANNER */}
        <div className={styles.bottomBanner}>
          <div className={styles.bottomContent}>
            <h4>Need Bulk Spares or Wholesale Accessories?</h4>
            <p>
              We supply verified OEM displays, charging flexes, batteries, and
              fast chargers at competitive dealer rates across Tirupur.
            </p>
          </div>
          <Link href="/contact" className={styles.customOrderBtn}>
            Request Spares Catalog <HiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
