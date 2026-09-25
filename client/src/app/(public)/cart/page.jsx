"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineTrash,
  HiMinus,
  HiPlus,
  HiOutlineShoppingBag,
  HiArrowRight,
  HiShieldCheck,
  HiTruck,
  HiChevronRight,
  HiHome,
} from "react-icons/hi";
import styles from "./cart.module.css";
import {
  useGetCartItemsQuery,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "../../store/api/cartApi";

export default function CartPage() {
  const router = useRouter();

  // 🟢 1. Detect Logged In Customer & Read Guest Cart
  const [currentUser, setCurrentUser] = useState(null);
  const [guestCart, setGuestCart] = useState([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setCurrentUser(storedUser);

      const storedGuestCart = JSON.parse(
        localStorage.getItem("cartItems") || "[]",
      );
      setGuestCart(storedGuestCart);
    } catch (e) {
      console.error("Failed to read user/cart", e);
    } finally {
      setIsClientLoaded(true);
    }
  }, []);

  const customerId = currentUser?.id || currentUser?._id;

  // 🟢 2. RTK Query: Fetch Cart from MongoDB if customer is logged in
  const { data: dbCartResponse = {}, isLoading: isDbCartLoading } =
    useGetCartItemsQuery(customerId, {
      skip: !customerId,
    });

  const [updateQuantityApi] = useUpdateCartQuantityMutation();
  const [removeItemApi] = useRemoveFromCartMutation();
  const [clearCartApi] = useClearCartMutation();

  // 🟢 3. Resolve active Cart Items
  const cartItems = useMemo(() => {
    if (customerId) {
      return dbCartResponse?.items || dbCartResponse?.cart?.items || [];
    }
    return guestCart;
  }, [customerId, dbCartResponse, guestCart]);

  // 🟢 4. UPDATE QUANTITY (+1 / -1)
  const handleQtyChange = async (item, delta) => {
    const newQty = Number(item.quantity) + delta;
    if (newQty < 1) return;

    if (customerId) {
      try {
        await updateQuantityApi({
          customerId,
          stockId: item.stockId,
          quantity: newQty,
        }).unwrap();
      } catch (err) {
        console.error("Failed to update cart quantity in DB:", err);
      }
    } else {
      const updated = guestCart.map((it) =>
        it.productId === item.productId && it.stockId === item.stockId
          ? {
              ...it,
              quantity: newQty,
              totalPrice: Number(it.price) * newQty,
            }
          : it,
      );
      setGuestCart(updated);
      localStorage.setItem("cartItems", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // 🟢 5. DELETE SINGLE ITEM
  const handleRemoveItem = async (item) => {
    if (customerId) {
      try {
        await removeItemApi({
          customerId,
          stockId: item.stockId,
        }).unwrap();
      } catch (err) {
        console.error("Failed to remove item from DB:", err);
      }
    } else {
      const updated = guestCart.filter(
        (it) =>
          !(it.productId === item.productId && it.stockId === item.stockId),
      );
      setGuestCart(updated);
      localStorage.setItem("cartItems", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // 🟢 6. CLEAR ENTIRE CART
  const handleClearCart = async () => {
    if (customerId) {
      try {
        await clearCartApi(customerId).unwrap();
      } catch (err) {
        console.error("Failed to clear DB cart:", err);
      }
    } else {
      setGuestCart([]);
      localStorage.removeItem("cartItems");
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // 🟢 7. PRICE CALCULATIONS
  const itemsTotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) =>
        acc + Number(item.totalPrice || item.price * item.quantity),
      0,
    );
  }, [cartItems]);

  const estimatedGST = useMemo(() => {
    return Math.round(itemsTotal * 0.18);
  }, [itemsTotal]);

  const subtotal = useMemo(() => {
    return itemsTotal - estimatedGST;
  }, [itemsTotal, estimatedGST]);

  const deliveryFee = itemsTotal >= 1500 || itemsTotal === 0 ? 0 : 99;
  const grandTotal = itemsTotal + deliveryFee;

  // Empty Cart View
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconCircle}>
          <HiOutlineShoppingBag size={48} className={styles.emptyBagIcon} />
        </div>
        <h2 className={styles.emptyTitle}>Your Cart is Empty</h2>
        <p className={styles.emptySubtitle}>
          Looks like you haven&apos;t added any smartphone accessories or spare
          parts to your cart yet.
        </p>
        <Link href="/product" className={styles.continueShoppingBtn}>
          <span>Explore Accessories</span>
          <HiArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb}>
        <Link href="/">
          <HiHome size={14} /> Home
        </Link>
        <HiChevronRight size={14} />
        <Link href="/product">Products</Link>
        <HiChevronRight size={14} />
        <span className={styles.activeBreadcrumb}>
          Cart ({cartItems.length})
        </span>
      </nav>

      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Shopping Cart</h1>
        <button onClick={handleClearCart} className={styles.clearCartBtn}>
          Clear All Items
        </button>
      </div>

      {/* Main Cart Grid */}
      <div className={styles.cartGrid}>
        {/* LEFT: Items List */}
        <div className={styles.itemsColumn}>
          {cartItems.map((item, idx) => {
            const productUrl = `/product/${item.slug || item.productId}`;

            return (
              <div
                key={`${item.productId}-${item.stockId || idx}`}
                className={styles.cartCard}
              >
                {/* Thumbnail */}
                <Link href={productUrl} className={styles.imgLink}>
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80"
                    }
                    alt={item.name}
                    className={styles.itemImg}
                  />
                </Link>

                {/* Details */}
                <div className={styles.itemDetails}>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemName}>
                      <Link href={productUrl}>{item.name}</Link>
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item)}
                      className={styles.removeBtn}
                      aria-label="Remove item"
                      title="Remove item"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </div>

                  {/* Variant info */}
                  {(item.colour || item.capacity) && (
                    <div className={styles.variantBadges}>
                      {item.colour && (
                        <span className={styles.variantBadge}>
                          Colour: {item.colour}
                        </span>
                      )}
                      {item.capacity && (
                        <span className={styles.variantBadge}>
                          Option: {item.capacity}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Controls & Price */}
                  <div className={styles.itemFooter}>
                    {/* Quantity Selector */}
                    <div className={styles.qtyBox}>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item, -1)}
                        disabled={Number(item.quantity) <= 1}
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        <HiMinus size={13} />
                      </button>
                      <span className={styles.qtyVal}>
                        <strong>{item.quantity}</strong> {item.unit || "item"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item, 1)}
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >
                        <HiPlus size={13} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className={styles.priceContainer}>
                      <span className={styles.singlePrice}>
                        ₹{Number(item.price)?.toLocaleString("en-IN")} each
                      </span>
                      <span className={styles.itemTotalPrice}>
                        ₹
                        {(
                          Number(item.totalPrice) ||
                          Number(item.price) * Number(item.quantity)
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Order Summary */}
        <aside className={styles.summaryColumn}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            {/* Subtotal without Tax */}
            <div className={styles.summaryRow}>
              <span>
                Subtotal (
                {cartItems.reduce(
                  (sum, it) => sum + Number(it.quantity || 1),
                  0,
                )}{" "}
                items)
              </span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            {/* Applicable 18% Tax */}
            <div className={styles.summaryRow}>
              <span>Applicable Taxes (GST 18%)</span>
              <span>₹{estimatedGST.toLocaleString("en-IN")}</span>
            </div>

            {/* Delivery Charge */}
            <div className={styles.summaryRow}>
              <span>Estimated Delivery</span>
              <span>
                {deliveryFee === 0 ? (
                  <strong className={styles.freeBadge}>FREE</strong>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>

            <div className={styles.divider} />

            {/* Grand Total */}
            <div className={`${styles.summaryRow} ${styles.grandTotalRow}`}>
              <span>Total Amount</span>
              <span className={styles.grandTotalPrice}>
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <p className={styles.taxNotice}>
              *All prices are inclusive of taxes & verified for dispatch.
            </p>

            <button
              type="button"
              onClick={() => {
                if (!customerId) {
                  router.push("/login");
                } else {
                  router.push("/checkout");
                }
              }}
              className={styles.checkoutBtn}
            >
              <span>
                {customerId ? "Proceed to Checkout" : "Sign In to Checkout"}
              </span>
              <HiArrowRight size={18} />
            </button>

            {/* Trust highlights */}
            <div className={styles.trustBox}>
              <div className={styles.trustItem}>
                <HiShieldCheck size={20} className={styles.trustIcon} />
                <span>100% Tested Genuine Mobile Spares & Gear</span>
              </div>
              <div className={styles.trustItem}>
                <HiTruck size={20} className={styles.trustIcon} />
                <span>Free delivery on orders above ₹1,500</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
