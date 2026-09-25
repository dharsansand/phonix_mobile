"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlinePhone,
} from "react-icons/hi";

import styles from "./auth.module.css";
import {
  useCustomerSignupMutation,
  useCustomerLoginMutation,
} from "../../store/api/customerApi";
import { useSyncCartMutation } from "../../store/api/cartApi";
import { useSyncWishlistMutation } from "../../store/api/wishlistApi";
import { setCredentials } from "../../store/authSlice";

export default function CustomerAuthPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);

  // RTK Query Hooks
  const [customerLogin, { isLoading: isLoginLoading, error: loginError }] =
    useCustomerLoginMutation();
  const [customerSignup, { isLoading: isSignUpLoading, error: signUpError }] =
    useCustomerSignupMutation();

  const [syncCart] = useSyncCartMutation();
  const [syncWishlist] = useSyncWishlistMutation();

  const [signUpSuccess, setSignUpSuccess] = useState("");

  // Form States
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // 🟢 HELPER: Sync localStorage Cart to MongoDB
  const handleCartSync = async (customerId) => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");

      if (Array.isArray(localCart) && localCart.length > 0) {
        await syncCart({
          customerId,
          items: localCart,
        }).unwrap();

        localStorage.removeItem("cartItems");
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      console.error("Cart sync error:", err);
    }
  };

  // 🟢 HELPER: Sync localStorage Wishlist to MongoDB safely
  const handleWishlistSync = async (customerId) => {
    try {
      const localWishlist = JSON.parse(
        localStorage.getItem("wishlistItems") || "[]",
      );

      if (Array.isArray(localWishlist) && localWishlist.length > 0) {
        const sanitizedItems = localWishlist.map((it) => ({
          productId: it.productId,
          stockId: it.stockId,
          variantId: it.variantId || null,
          name: it.name,
          slug: it.slug || "",
          colour: it.colour || "",
          capacity: it.capacity || "",
          image: it.image || "",
          price: Number(it.price || 0),
          totalPrice: Number(it.totalPrice || it.price || 0),
          original_price: it.original_price ? Number(it.original_price) : null,
        }));

        await syncWishlist({
          customerId,
          items: sanitizedItems,
        }).unwrap();

        localStorage.removeItem("wishlistItems");
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (err) {
      console.error("Wishlist sync error:", err);
    }
  };

  // 🟢 1. SIGN IN SUBMIT
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignUpSuccess("");

    if (!signInData.email || !signInData.password) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      const res = await customerLogin({
        email: signInData.email.trim(),
        password: signInData.password,
      }).unwrap();

      const accessToken =
        res.accessToken ||
        res.token ||
        res.data?.accessToken ||
        res.data?.token;
      const refreshToken = res.refreshToken || res.data?.refreshToken;
      const user = res.user || res.customer || res.data?.user || res.data;
      const customerId = user?.id || user?._id;

      dispatch(
        setCredentials({
          user: { ...user, role: "customer" },
          accessToken,
          refreshToken,
        }),
      );

      if (customerId) {
        await Promise.all([
          handleCartSync(customerId),
          handleWishlistSync(customerId),
        ]);
      }

      router.push("/cart");
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  // 🟢 2. SIGN UP SUBMIT
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignUpSuccess("");

    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      alert("Please fill in all required fields (Name, Email, Password).");
      return;
    }

    try {
      const payload = {
        name: signUpData.name.trim(),
        email: signUpData.email.trim(),
        phone: signUpData.phone ? signUpData.phone.trim() : "",
        password: signUpData.password,
      };

      await customerSignup(payload).unwrap();

      setSignUpSuccess("Account created successfully! Please Sign In.");
      setSignUpData({ name: "", email: "", phone: "", password: "" });

      setTimeout(() => {
        setIsSignUp(false);
      }, 1200);
    } catch (err) {
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.glowCircleTop} />
      <div className={styles.glowCircleBottom} />

      <div
        className={`${styles.authContainer} ${isSignUp ? styles.activeSignUp : ""}`}
      >
        {/* SIGN IN FORM */}
        <div className={`${styles.formBox} ${styles.signInBox}`}>
          <form onSubmit={handleSignInSubmit} className={styles.authForm}>
            <div className={styles.brandBadge}>✦ PHONIX MOBILE</div>
            <h1 className={styles.title}>Customer Sign In</h1>

            <span className={styles.subtext}>
              Access your repair status, orders, and saved spares
            </span>

            {signUpSuccess && (
              <div className={styles.successAlert}>{signUpSuccess}</div>
            )}

            {loginError && (
              <div className={styles.errorAlert}>
                {loginError.data?.message || "Invalid email or password"}
              </div>
            )}

            <div className={styles.inputGroup}>
              <HiOutlineMail className={styles.inputIcon} size={18} />
              <input
                type="email"
                placeholder="Enter Email"
                required
                autoComplete="email"
                value={signInData.email}
                onChange={(e) =>
                  setSignInData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={styles.inputField}
              />
            </div>

            <div className={styles.inputGroup}>
              <HiOutlineLockClosed className={styles.inputIcon} size={18} />
              <input
                type="password"
                placeholder="Enter Password"
                required
                autoComplete="current-password"
                value={signInData.password}
                onChange={(e) =>
                  setSignInData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className={styles.inputField}
              />
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className={styles.primaryBtn}
            >
              {isLoginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* SIGN UP FORM */}
        <div className={`${styles.formBox} ${styles.signUpBox}`}>
          <form onSubmit={handleSignUpSubmit} className={styles.authForm}>
            <div className={styles.brandBadge}>✦ QUALITY IS OUR VALIDITY</div>
            <h1 className={styles.title}>Create Account</h1>

            <span className={styles.subtext}>
              Join Phonix Mobile customer portal
            </span>

            {signUpError && (
              <div className={styles.errorAlert}>
                {signUpError.data?.message || "Failed to create account."}
              </div>
            )}

            <div className={styles.inputGroup}>
              <HiOutlineUser className={styles.inputIcon} size={18} />
              <input
                type="text"
                placeholder="Full Name"
                required
                autoComplete="name"
                value={signUpData.name}
                onChange={(e) =>
                  setSignUpData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={styles.inputField}
              />
            </div>

            <div className={styles.inputGroup}>
              <HiOutlineMail className={styles.inputIcon} size={18} />
              <input
                type="email"
                placeholder="Email Address"
                required
                autoComplete="email"
                value={signUpData.email}
                onChange={(e) =>
                  setSignUpData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={styles.inputField}
              />
            </div>

            <div className={styles.inputGroup}>
              <HiOutlinePhone className={styles.inputIcon} size={18} />
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                autoComplete="tel"
                value={signUpData.phone}
                onChange={(e) =>
                  setSignUpData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={styles.inputField}
              />
            </div>

            <div className={styles.inputGroup}>
              <HiOutlineLockClosed className={styles.inputIcon} size={18} />
              <input
                type="password"
                placeholder="Create Password"
                required
                autoComplete="new-password"
                value={signUpData.password}
                onChange={(e) =>
                  setSignUpData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className={styles.inputField}
              />
            </div>

            <button
              type="submit"
              disabled={isSignUpLoading}
              className={styles.primaryBtn}
            >
              {isSignUpLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* 🟢 SLIDING OVERLAY CONTAINER (DESKTOP) */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h2 className={styles.overlayTitle}>Welcome Back!</h2>
              <p className={styles.overlayText}>
                To view your device repairs, saved spares, and orders, please
                sign in.
              </p>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </div>

            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h2 className={styles.overlayTitle}>Hello, Friend!</h2>
              <p className={styles.overlayText}>
                Register now to track live smartphone repairs and shop genuine
                accessories.
              </p>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SWITCHER */}
        <div className={styles.mobileSwitcher}>
          <button
            type="button"
            className={`${styles.switchBtn} ${!isSignUp ? styles.switchActive : ""}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`${styles.switchBtn} ${isSignUp ? styles.switchActive : ""}`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
