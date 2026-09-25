"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import styles from "./admin.module.css";
import GhostFibers from "../../componses/GhostFibers";
import { useLoginMutation } from "../../store/api/userApi";
import { setCredentials } from "../../store/authSlice";

export default function AdminLogin() {
  const router = useRouter();
  const dispatch = useDispatch();

  // RTK Query Mutation Hook
  const [login, { isLoading, error }] = useLoginMutation();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({
        email: formData.identifier,
        password: formData.password,
      }).unwrap();

      const accessToken =
        res.accessToken ||
        res.token ||
        res.data?.accessToken ||
        res.data?.token;
      const refreshToken = res.refreshToken || res.data?.refreshToken;
      const user = res.user || res.data?.user || res.data;

      dispatch(
        setCredentials({
          user,
          accessToken,
          refreshToken,
        }),
      );

      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Animated Fibers in Brand Neon Colors */}
      <GhostFibers
        fiberCount={25}
        palette={["#00d2ff", "#ff9f1c", "#d946ef", "#121826"]}
      />

      <motion.div
        className={styles.splitCard}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left Hero - Phonix Mobile Brand */}
        <div className={styles.leftPanel}>
          <div className={styles.neonGlow}></div>
          <div className={styles.leftContent}>
            <span className={styles.tagline}>
              NO.1 MOBILE SERVICE • SINCE 2016
            </span>
            <h1 className={styles.heroTitle}>PHONIX MOBILE</h1>
            <p className={styles.heroSub}>
              Quality is our validity. Admin portal for services, inventory, and
              repairs.
            </p>
            <div className={styles.locationBadge}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Periyar Colony, Tirupur</span>
            </div>
          </div>

          <svg
            className={styles.waveDivider}
            viewBox="0 0 100 600"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C65,130 10,240 85,350 C125,430 25,530 100,600 L100,0 Z" />
          </svg>
        </div>

        {/* Right Form - Sign in */}
        <div className={styles.rightPanel}>
          <div className={styles.formBox}>
            <div className={styles.formHeader}>
              <div className={styles.brandIconCircle}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00d2ff"
                  strokeWidth="2.2"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <h2 className={styles.formTitle}>ADMIN GATEWAY</h2>
              <p className={styles.formSubtitle}>
                Sign in to manage your workshop
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className={styles.errorBox}>
                {error.data?.message ||
                  "Invalid credentials. Please try again."}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputField}>
                <span className={styles.inputIcon}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="identifier"
                  required
                  placeholder="Username or Email"
                  value={formData.identifier}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputField}>
                <span className={styles.inputIcon}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className={styles.submitBtn}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.97 }}
              >
                {isLoading ? "Authenticating..." : "Access Dashboard"}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
