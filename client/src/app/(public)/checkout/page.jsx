"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiChevronRight,
  HiArrowRight,
  HiOutlinePlus,
  HiHome,
} from "react-icons/hi";
import styles from "./checkout.module.css";
import {
  useGetCartItemsQuery,
  useClearCartMutation,
} from "../../store/api/cartApi";
import {
  useGetAddressesQuery,
  useSaveAddressMutation,
  useSelectAddressMutation,
} from "../../store/api/customerApi";
import { useCreateOrderMutation } from "../../store/api/orderApi";

export default function CheckoutPage() {
  const router = useRouter();

  // 1. Customer detection
  const [currentUser, setCurrentUser] = useState(null);
  const [guestCart, setGuestCart] = useState([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      setCurrentUser(user);

      const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setGuestCart(cart);

      // Prefill customer details if logged in
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        }));
      }
    } catch (e) {
      console.error("Storage error:", e);
    } finally {
      setIsClientLoaded(true);
    }
  }, []);

  const customerId = currentUser?.id || currentUser?._id;

  // 2. Fetch Cart from DB if logged in
  const { data: dbCartResponse = {} } = useGetCartItemsQuery(customerId, {
    skip: !customerId,
  });

  // 3. Fetch Saved Addresses from DB if logged in
  const { data: addressResponse = {} } = useGetAddressesQuery(customerId, {
    skip: !customerId,
  });

  const savedAddresses = useMemo(() => {
    return addressResponse?.addresses || [];
  }, [addressResponse?.addresses]);

  const selectedAddressId = addressResponse?.selectedAddressId;

  const [saveAddressApi] = useSaveAddressMutation();
  const [selectAddressApi] = useSelectAddressMutation();
  const [clearCartApi] = useClearCartMutation();
  const [createOrderApi, { isLoading: isPlacingOrder }] =
    useCreateOrderMutation();

  const cartItems = useMemo(() => {
    if (customerId) {
      return dbCartResponse?.items || dbCartResponse?.cart?.items || [];
    }
    return guestCart;
  }, [customerId, dbCartResponse, guestCart]);

  // Selected Address State
  const [selectedAddress, setSelectedAddress] = useState(null);

  // New Address Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
  });

  useEffect(() => {
    if (savedAddresses.length > 0) {
      const active =
        savedAddresses.find(
          (a) => String(a._id) === String(selectedAddressId),
        ) || savedAddresses[0];

      setSelectedAddress(active);
      setShowAddForm(false);
    } else if (isClientLoaded && (!customerId || savedAddresses.length === 0)) {
      setShowAddForm(true);
    }
  }, [savedAddresses, selectedAddressId, isClientLoaded, customerId]);

  // Price calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, it) => sum + Number(it.totalPrice || it.price * it.quantity),
      0,
    );
  }, [cartItems]);

  const deliveryFee = subtotal > 1500 || subtotal === 0 ? 0 : 99;
  const estimatedGST = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + estimatedGST;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // SELECT ADDRESS
  const handleSelectAddress = async (addr) => {
    setSelectedAddress(addr);
    setShowAddForm(false);

    if (customerId) {
      try {
        await selectAddressApi({
          customerId,
          addressId: addr._id,
        }).unwrap();
      } catch (err) {
        console.error("Failed to set active address:", err);
      }
    }
  };

  // SAVE NEW ADDRESS
  const handleSaveNewAddress = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {
      alert("Please fill all required address fields.");
      return;
    }

    if (customerId) {
      try {
        const res = await saveAddressApi({
          customerId,
          addressData: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            isDefault: true,
          },
        }).unwrap();

        const newlyAdded =
          res.savedAddresses?.[res.savedAddresses.length - 1] || null;

        if (newlyAdded) {
          setSelectedAddress(newlyAdded);
        }

        setShowAddForm(false);
      } catch (err) {
        console.error("Failed to save address:", err);
      }
    } else {
      setSelectedAddress({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        streetAddress: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });
      setShowAddForm(false);
    }
  };

  // PLACE ORDER WITH RTK QUERY MUTATION
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const activeAddr = selectedAddress || (formData.address ? formData : null);

    if (!activeAddr || (!activeAddr.streetAddress && !activeAddr.address)) {
      alert("Please select or enter a delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const orderPayload = {
        customerId: customerId || null,
        items: cartItems.map((item) => ({
          productId: item.productId,
          stockId: item.stockId,
          variantId: item.variantId || null,
          name: item.name,
          slug: item.slug || "",
          colour: item.colour || "",
          capacity: item.capacity || "",
          unit: item.unit || "item",
          image: item.image || "",
          price: Number(item.price),
          quantity: Number(item.quantity || 1),
          totalPrice: Number(
            item.totalPrice || item.price * (item.quantity || 1),
          ),
        })),
        deliveryAddress: {
          name: activeAddr.name,
          phone: activeAddr.phone,
          email: activeAddr.email || currentUser?.email || "",
          streetAddress: activeAddr.streetAddress || activeAddr.address,
          city: activeAddr.city,
          state: activeAddr.state || "Tamil Nadu",
          pincode: activeAddr.pincode,
        },
        subtotal: Number(subtotal),
        deliveryFee: Number(deliveryFee),
        tax: Number(estimatedGST),
        totalAmount: Number(grandTotal),
        paymentMethod: "cod",
      };

      const res = await createOrderApi(orderPayload).unwrap();
      setOrderId(res.orderId || res.order?.orderId);

      if (!customerId) {
        localStorage.removeItem("cartItems");
      }

      window.dispatchEvent(new Event("cartUpdated"));
      setIsOrderPlaced(true);
    } catch (err) {
      console.error("Order placement failed:", err);
      alert(err.data?.message || "Failed to place order. Please try again.");
    }
  };

  if (!isClientLoaded) {
    return <div className={styles.loadingBox}>Loading Checkout...</div>;
  }

  // SUCCESS CONFIRMATION SCREEN
  if (isOrderPlaced) {
    const activeAddr = selectedAddress || formData;

    return (
      <div className={styles.successWrapper}>
        <div className={styles.successCard}>
          <div className={styles.checkCircle}>
            <HiOutlineCheckCircle size={54} color="#22c55e" />
          </div>
          <span className={styles.successTag}>ORDER CONFIRMED</span>
          <h1 className={styles.successTitle}>Thank You For Your Order!</h1>
          <p className={styles.orderNumber}>
            Order ID: <strong>{orderId}</strong>
          </p>

          <p className={styles.successSub}>
            We have received your order. Our team in Tirupur will carefully
            package and dispatch your accessories and spares to:
          </p>

          <div className={styles.addressSummary}>
            <strong>{activeAddr.name}</strong> ({activeAddr.phone})<br />
            {activeAddr.streetAddress || activeAddr.address}, {activeAddr.city},{" "}
            {activeAddr.state} - {activeAddr.pincode}
          </div>

          <div className={styles.btnRow}>
            <Link href="/" className={styles.continueBtn}>
              Back to Home
            </Link>
            <Link href="/product" className={styles.shopBtn}>
              Explore More Gear <HiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart View
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyBox}>
        <h2>Your Cart is Empty</h2>
        <p>Please add items to your cart before proceeding to checkout.</p>
        <Link href="/product" className={styles.shopBtn}>
          Browse Products
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
        <Link href="/cart">Cart</Link>
        <HiChevronRight size={13} />
        <span className={styles.activeBreadcrumb}>Checkout</span>
      </nav>

      <h1 className={styles.pageHeading}>Checkout & Delivery</h1>

      <div className={styles.checkoutGrid}>
        {/* LEFT COLUMN: Saved Addresses & Form */}
        <div className={styles.leftCol}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderBetween}>
              <div className={styles.cardHeaderTitle}>
                <span className={styles.stepBadge}>1</span>
                <h3>Delivery Address</h3>
              </div>
              {savedAddresses.length > 0 && !showAddForm && (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className={styles.addAddressBtn}
                >
                  <HiOutlinePlus size={16} /> Add New Address
                </button>
              )}
            </div>

            {/* LIST OF SAVED ADDRESSES */}
            {savedAddresses.length > 0 && !showAddForm && (
              <div className={styles.addressList}>
                {savedAddresses.map((addr) => {
                  const isSelected =
                    selectedAddress &&
                    String(selectedAddress._id) === String(addr._id);

                  return (
                    <div
                      key={addr._id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`${styles.addressCard} ${
                        isSelected ? styles.addressCardActive : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedAddr"
                        checked={isSelected}
                        onChange={() => handleSelectAddress(addr)}
                        className={styles.radioInput}
                      />
                      <div className={styles.addressDetails}>
                        <div className={styles.addressHeader}>
                          <span className={styles.addrName}>{addr.name}</span>
                          <span className={styles.addrPhone}>{addr.phone}</span>
                          {addr.isDefault && (
                            <span className={styles.defaultTag}>Default</span>
                          )}
                        </div>
                        <p className={styles.addrText}>
                          {addr.streetAddress}, {addr.city}, {addr.state} -{" "}
                          <strong>{addr.pincode}</strong>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ADD NEW ADDRESS FORM */}
            {(showAddForm || savedAddresses.length === 0) && (
              <form
                onSubmit={handleSaveNewAddress}
                className={styles.addressForm}
              >
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Recipient's Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Order updates will be sent here"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Street Address / Door No *</label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    placeholder="Flat / House No, Street, Landmark"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.formRowThree}>
                  <div className={styles.formGroup}>
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Tirupur"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="6-digit Pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formActionBtns}>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className={styles.saveAddrBtn}>
                    Save & Use This Address
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <h3>Order Summary</h3>

            {/* Items List */}
            <div className={styles.itemList}>
              {cartItems.map((item, idx) => (
                <div key={item.stockId || idx} className={styles.summaryItem}>
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&auto=format&fit=crop&q=80"
                    }
                    alt={item.name}
                    className={styles.itemThumb}
                  />
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    <span className={styles.itemMeta}>
                      Qty: {item.quantity} {item.unit || "item"}{" "}
                      {item.colour ? `• ${item.colour}` : ""}
                    </span>
                    <span className={styles.itemPrice}>
                      ₹
                      {(
                        item.totalPrice || item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.divider} />

            {/* Calculations */}
            <div className={styles.calcRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className={styles.calcRow}>
              <span>Estimated Delivery</span>
              <span>
                {deliveryFee === 0 ? (
                  <strong className={styles.freeText}>FREE</strong>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>

            <div className={styles.calcRow}>
              <span>Estimated Taxes (GST 5%)</span>
              <span>₹{estimatedGST.toLocaleString("en-IN")}</span>
            </div>

            <div className={styles.divider} />

            <div className={`${styles.calcRow} ${styles.totalRow}`}>
              <span>Total Amount</span>
              <span className={styles.grandTotal}>
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Place Order Button */}
            <button
              type="button"
              disabled={isPlacingOrder}
              onClick={handlePlaceOrder}
              className={styles.placeOrderBtn}
            >
              {isPlacingOrder
                ? "Placing Order..."
                : "Place Order (Cash On Delivery)"}
            </button>

            {/* Trust Assurances */}
            <div className={styles.trustFooter}>
              <div className={styles.trustItem}>
                <HiOutlineShieldCheck size={20} className={styles.trustIcon} />
                <span>100% Tested Genuine Mobile Spares</span>
              </div>
              <div className={styles.trustItem}>
                <HiOutlineTruck size={20} className={styles.trustIcon} />
                <span>Express dispatch across Tirupur & Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
