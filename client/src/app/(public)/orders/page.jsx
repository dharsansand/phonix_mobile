"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiChevronRight,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineLocationMarker,
  HiArrowRight,
  HiHome,
} from "react-icons/hi";
import styles from "./orders.module.css";
import { useGetCustomerOrdersQuery } from "../../store/api/orderApi";

export default function MyOrdersPage() {
  const router = useRouter();

  // 1. Detect Logged In Customer
  const [currentUser, setCurrentUser] = useState(null);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      setCurrentUser(user);
    } catch (e) {
      console.error(e);
    } finally {
      setIsClientLoaded(true);
    }
  }, []);

  const customerId = currentUser?.id || currentUser?._id;

  // 2. Fetch Orders for this Customer
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetCustomerOrdersQuery(customerId, {
    skip: !customerId,
  });

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return (
          <span className={`${styles.badge} ${styles.badgeDelivered}`}>
            <HiOutlineCheckCircle size={15} /> Delivered
          </span>
        );
      case "shipped":
        return (
          <span className={`${styles.badge} ${styles.badgeShipped}`}>
            <HiOutlineTruck size={15} /> Dispatched (Shipped)
          </span>
        );
      case "processing":
      case "confirmed":
        return (
          <span className={`${styles.badge} ${styles.badgeProcessing}`}>
            <HiOutlineClock size={15} /> Quality Check & Packing
          </span>
        );
      case "cancelled":
        return (
          <span className={`${styles.badge} ${styles.badgeCancelled}`}>
            <HiOutlineXCircle size={15} /> Cancelled
          </span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.badgePlaced}`}>
            <HiOutlineClock size={15} /> Order Placed
          </span>
        );
    }
  };

  if (!isClientLoaded) {
    return (
      <div className={styles.centerBox}>
        <div className={styles.spinner} />
        <p>Loading Orders...</p>
      </div>
    );
  }

  // Not Logged In View
  if (!customerId) {
    return (
      <div className={styles.centerBox}>
        <div className={styles.emptyIconCircle}>
          <HiOutlineShoppingBag size={48} className={styles.cyanIcon} />
        </div>
        <h2>Sign In to View Orders</h2>
        <p>
          Please log in with your phone or email to track your Phonix Mobile
          orders, dispatch receipts, and live courier status.
        </p>
        <Link href="/login" className={styles.primaryBtn}>
          <span>Sign In Now</span>
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
        <HiChevronRight size={13} />
        <span className={styles.activeBreadcrumb}>My Orders</span>
      </nav>

      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Order History</h1>
          <p className={styles.pageSub}>
            Track live dispatch status and view receipts for your smartphone
            accessories & spares.
          </p>
        </div>
        <span className={styles.orderCount}>Total Orders: {orders.length}</span>
      </div>

      {isLoading ? (
        <div className={styles.centerBox}>
          <div className={styles.spinner} />
          <p>Fetching your orders from Phonix Mobile...</p>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className={styles.emptyCard}>
          <div className={styles.emptyIconCircle}>
            <HiOutlineShoppingBag size={48} className={styles.cyanIcon} />
          </div>
          <h2>No Orders Placed Yet</h2>
          <p>
            You haven&apos;t ordered any smartphone accessories or spares yet.
            Explore our genuine collection today.
          </p>
          <Link href="/product" className={styles.primaryBtn}>
            <span>Explore Accessories</span>
            <HiArrowRight size={18} />
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className={styles.ordersList}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            const formattedDate = new Date(order.createdAt).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              },
            );

            return (
              <div key={order._id} className={styles.orderCard}>
                {/* 1. Header Bar */}
                <div className={styles.cardHeader}>
                  <div className={styles.headerLeft}>
                    <div>
                      <span className={styles.label}>ORDER ID</span>
                      <strong className={styles.orderIdText}>
                        {order.orderId}
                      </strong>
                    </div>
                    <div>
                      <span className={styles.label}>DATE PLACED</span>
                      <span className={styles.valueText}>{formattedDate}</span>
                    </div>
                    <div>
                      <span className={styles.label}>TOTAL AMOUNT</span>
                      <strong className={styles.priceHighlight}>
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.headerRight}>
                    {renderStatusBadge(order.orderStatus)}
                    <button
                      type="button"
                      onClick={() => toggleExpand(order._id)}
                      className={styles.expandBtn}
                      aria-label="Toggle Details"
                    >
                      {isExpanded ? (
                        <HiOutlineChevronUp size={20} />
                      ) : (
                        <HiOutlineChevronDown size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Items Preview Row */}
                <div className={styles.itemsPreview}>
                  {order.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=120&auto=format&fit=crop&q=80"
                        }
                        alt={item.name}
                        className={styles.thumb}
                      />
                      <div className={styles.itemMeta}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <div className={styles.itemSpecs}>
                          {item.colour && <span>Colour: {item.colour}</span>}
                          {item.capacity && (
                            <span>Option: {item.capacity}</span>
                          )}
                          <span>
                            Qty: {item.quantity} {item.unit || "item"}
                          </span>
                        </div>
                        <span className={styles.itemTotal}>
                          ₹
                          {Number(
                            item.totalPrice || item.price * item.quantity,
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. Collapsible Accordion for Full Address, Tracking, & Payment */}
                {isExpanded && (
                  <div className={styles.expandedDetails}>
                    <div className={styles.detailsGrid}>
                      {/* Delivery Address */}
                      <div className={styles.detailBlock}>
                        <h5>
                          <HiOutlineLocationMarker size={16} /> Delivery Address
                        </h5>
                        <p className={styles.addressLine}>
                          <strong>{order.deliveryAddress?.name}</strong> (
                          {order.deliveryAddress?.phone})
                        </p>
                        <p className={styles.addressLine}>
                          {order.deliveryAddress?.streetAddress},{" "}
                          {order.deliveryAddress?.city},{" "}
                          {order.deliveryAddress?.state} -{" "}
                          {order.deliveryAddress?.pincode}
                        </p>
                      </div>

                      {/* Payment & Shipping Info */}
                      <div className={styles.detailBlock}>
                        <h5>Payment & Courier Dispatch</h5>
                        <p>
                          <strong>Payment Method:</strong>{" "}
                          {order.paymentMethod?.toUpperCase() === "COD"
                            ? "Cash on Delivery (COD)"
                            : "Prepaid Online"}
                        </p>
                        <p>
                          <strong>Payment Status:</strong>{" "}
                          <span
                            style={{
                              color:
                                order.paymentStatus === "paid"
                                  ? "#22c55e"
                                  : "#ff9f1c",
                              fontWeight: 800,
                              textTransform: "capitalize",
                            }}
                          >
                            {order.paymentStatus}
                          </span>
                        </p>
                        {order.trackingNumber && (
                          <p>
                            <strong>Tracking No:</strong> {order.trackingNumber}{" "}
                            ({order.courierPartner})
                          </p>
                        )}
                      </div>

                      {/* Financial Breakdown */}
                      <div className={styles.detailBlock}>
                        <h5>Invoice Breakdown</h5>
                        <div className={styles.calcRow}>
                          <span>Items Subtotal:</span>
                          <span>
                            ₹{Number(order.subtotal).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className={styles.calcRow}>
                          <span>Delivery Charge:</span>
                          <span>
                            {order.deliveryFee === 0
                              ? "FREE"
                              : `₹${order.deliveryFee}`}
                          </span>
                        </div>
                        <div className={styles.calcRow}>
                          <span>GST (5%):</span>
                          <span>
                            ₹{Number(order.tax).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div
                          className={`${styles.calcRow} ${styles.totalCalcRow}`}
                        >
                          <span>Grand Total:</span>
                          <strong>
                            ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
