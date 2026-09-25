"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiArrowRight,
  HiChevronRight,
  HiShieldCheck,
  HiTruck,
  HiHome,
} from "react-icons/hi";
import styles from "./wishlist.module.css";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} from "../../store/api/wishlistApi";
import { useAddToCartMutation } from "../../store/api/cartApi";

export default function WishlistPage() {
  const router = useRouter();

  // 🟢 1. Detect Logged In Customer & LocalStorage Wishlist
  const [currentUser, setCurrentUser] = useState(null);
  const [guestWishlist, setGuestWishlist] = useState([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setCurrentUser(storedUser);

      const storedGuest = JSON.parse(
        localStorage.getItem("wishlistItems") || "[]",
      );
      setGuestWishlist(storedGuest);
    } catch (e) {
      console.error("Failed to read user/wishlist", e);
    } finally {
      setIsClientLoaded(true);
    }
  }, []);

  const customerId = currentUser?.id || currentUser?._id;

  // 🟢 2. RTK Query: Fetch Wishlist from MongoDB if logged in
  const { data: dbWishlistResponse = {}, isLoading: isDbWishlistLoading } =
    useGetWishlistQuery(customerId, {
      skip: !customerId,
    });

  const [removeFromWishlistApi] = useRemoveFromWishlistMutation();
  const [clearWishlistApi] = useClearWishlistMutation();
  const [addToCartApi] = useAddToCartMutation();

  // 🟢 3. Resolve active Wishlist Items
  const wishlistItems = useMemo(() => {
    if (customerId) {
      return (
        dbWishlistResponse?.items || dbWishlistResponse?.wishlist?.items || []
      );
    }
    return guestWishlist;
  }, [customerId, dbWishlistResponse, guestWishlist]);

  // 🟢 4. Remove Single Item
  const handleRemove = async (productId, stockId) => {
    if (customerId) {
      try {
        await removeFromWishlistApi({
          customerId,
          stockId,
        }).unwrap();
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (err) {
        console.error("Failed to remove item from database wishlist:", err);
      }
    } else {
      const updated = guestWishlist.filter(
        (item) => !(item.productId === productId && item.stockId === stockId),
      );
      setGuestWishlist(updated);
      localStorage.setItem("wishlistItems", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  };

  // 🟢 5. Clear Entire Wishlist
  const handleClearAll = async () => {
    if (customerId) {
      try {
        await clearWishlistApi(customerId).unwrap();
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (err) {
        console.error("Failed to clear database wishlist:", err);
      }
    } else {
      setGuestWishlist([]);
      localStorage.removeItem("wishlistItems");
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  };

  // 🟢 6. Move to Cart & Remove from Wishlist
  const handleMoveToCart = async (item) => {
    const cartPayload = {
      productId: item.productId,
      stockId: item.stockId,
      name: item.name,
      variantId: item.variantId || null,
      colour: item.colour || "",
      capacity: item.capacity || "",
      unit: item.unit || "item",
      image: item.image,
      price: Number(item.price),
      totalPrice: Number(item.price),
      quantity: 1,
      slug: item.slug || item.productId,
    };

    if (customerId) {
      try {
        await addToCartApi({
          customerId,
          ...cartPayload,
        }).unwrap();

        await removeFromWishlistApi({
          customerId,
          stockId: item.stockId,
        }).unwrap();

        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (err) {
        console.error("Failed to move item to cart:", err);
      }
    } else {
      try {
        const existingCart = JSON.parse(
          localStorage.getItem("cartItems") || "[]",
        );
        const idx = existingCart.findIndex(
          (it) =>
            it.productId === cartPayload.productId &&
            it.stockId === cartPayload.stockId,
        );

        if (idx > -1) {
          existingCart[idx].quantity += 1;
          existingCart[idx].totalPrice += cartPayload.price;
        } else {
          existingCart.push(cartPayload);
        }
        localStorage.setItem("cartItems", JSON.stringify(existingCart));

        const updated = guestWishlist.filter(
          (it) =>
            !(it.productId === item.productId && it.stockId === item.stockId),
        );
        setGuestWishlist(updated);
        localStorage.setItem("wishlistItems", JSON.stringify(updated));

        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (e) {
        console.error("Cart error", e);
      }
    }

    router.push("/cart");
  };

  // Loading State
  if (!isClientLoaded || (customerId && isDbWishlistLoading)) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading Phonix Mobile Wishlist...</p>
      </div>
    );
  }

  // Empty State
  if (wishlistItems.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconCircle}>
          <HiOutlineHeart size={48} className={styles.emptyHeartIcon} />
        </div>
        <h2 className={styles.emptyTitle}>Your Wishlist is Empty</h2>
        <p className={styles.emptySubtitle}>
          Save smartphone accessories, fast chargers, and replacement spares you
          like by tapping the heart icon.
        </p>
        <Link href="/product" className={styles.exploreBtn}>
          <span>Explore Products</span>
          <HiArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/">
          <HiHome size={14} /> Home
        </Link>
        <HiChevronRight size={14} />
        <Link href="/product">Products</Link>
        <HiChevronRight size={14} />
        <span className={styles.activeBreadcrumb}>
          Wishlist ({wishlistItems.length})
        </span>
      </nav>

      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>My Wishlist</h1>
          <p className={styles.pageSubtitle}>
            Saved accessories and verified spares ready for your device.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          className={styles.clearBtn}
        >
          Clear Wishlist
        </button>
      </div>

      {/* Grid of Wishlist Items */}
      <div className={styles.wishlistGrid}>
        {wishlistItems.map((item, idx) => {
          const productUrl = `/product/${item.slug || item.productId}`;

          return (
            <div
              key={`${item.productId}-${item.stockId || idx}`}
              className={styles.itemCard}
            >
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleRemove(item.productId, item.stockId)}
                className={styles.deleteBtn}
                aria-label="Remove item"
                title="Remove from wishlist"
              >
                <HiOutlineTrash size={16} />
              </button>

              {/* Product Image */}
              <Link href={productUrl} className={styles.imgLink}>
                <div className={styles.imgStage}>
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80"
                    }
                    alt={item.name}
                    className={styles.productImg}
                  />
                </div>
              </Link>

              {/* Info */}
              <div className={styles.cardBody}>
                <h3 className={styles.productTitle}>
                  <Link href={productUrl}>{item.name}</Link>
                </h3>

                {/* Variant Attributes */}
                {(item.colour || item.capacity) && (
                  <div className={styles.variantTags}>
                    {item.colour && <span>Colour: {item.colour}</span>}
                    {item.capacity && <span>Option: {item.capacity}</span>}
                  </div>
                )}

                {/* Price Row */}
                <div className={styles.priceRow}>
                  <span className={styles.price}>
                    ₹{Number(item.price)?.toLocaleString("en-IN")}
                  </span>
                  {item.original_price &&
                    Number(item.original_price) > Number(item.price) && (
                      <span className={styles.originalPrice}>
                        ₹{Number(item.original_price)?.toLocaleString("en-IN")}
                      </span>
                    )}
                </div>

                {/* Move To Cart Button */}
                <button
                  type="button"
                  onClick={() => handleMoveToCart(item)}
                  className={styles.moveCartBtn}
                >
                  <HiOutlineShoppingBag size={18} />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Highlights */}
      <div className={styles.trustBanner}>
        <div className={styles.trustItem}>
          <HiShieldCheck size={24} className={styles.trustIcon} />
          <div>
            <h4>100% Tested Genuine Spares</h4>
            <p>
              Guaranteed original quality components with replacement warranty.
            </p>
          </div>
        </div>
        <div className={styles.trustItem}>
          <HiTruck size={24} className={styles.trustIcon} />
          <div>
            <h4>Express Dispatch in Tirupur</h4>
            <p>Direct from Phonix Mobile workshop in Periyar Colony.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
