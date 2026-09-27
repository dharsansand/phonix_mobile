"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "../../store/api/userApi";
import { logOut } from "../../store/authSlice";
import styles from "./sidebar.module.css";

const Icons = {
  Home: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Profile: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Measure: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
  Analyze: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Reduce: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Report: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Menu: () => (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  BackArrow: () => (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Logout: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { label: "Home", href: "/admin/dashboard", icon: Icons.Home },
  { label: "Banner", href: "/admin/banner", icon: Icons.Profile },
  { label: "category", href: "/admin/category", icon: Icons.Measure },
  { label: "product", href: "/admin/product", icon: Icons.Analyze },
  { label: "Stock", href: "/admin/stock", icon: Icons.Reduce },
  { label: "stock Update", href: "/admin/stock-update", icon: Icons.Report },
  { label: "orders", href: "/admin/orders", icon: Icons.Report },
  { label: "services", href: "/admin/services", icon: Icons.Report },
];

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = useSelector((state) => state.auth?.accessToken);
  const {
    data: user,
    isLoading,
    isError,
  } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    if (isError) {
      dispatch(logOut());
      router.replace("/admin/login");
    }
  }, [token, isError, router, dispatch]);

  const handleLogout = () => {
    dispatch(logOut());
    router.replace("/admin/login");
  };

  if (!token || isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "var(--space-cadet)",
          color: "var(--tan)",
          fontSize: "1.1rem",
        }}
      >
        <p>Verifying session...</p>
      </div>
    );
  }

  // Get user details
  const userName = user?.name || user?.email?.split("@")[0] || "Admin";
  const userEmail = user?.email || "admin@example.com";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className={styles.container}>
      {/* 1. DESKTOP FLOATING PILL SIDEBAR */}
      <aside className={styles.sidebarWrapper}>
        <div
          className={`${styles.sidebar} ${collapsed ? styles.collapsed : styles.expanded}`}
        >
          {/* Header row with logo & collapse arrow */}
          <div className={styles.header}>
            <div className={styles.logoBadge}>🌱</div>
            {!collapsed && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className={styles.toggleBtn}
                title="Collapse sidebar"
              >
                <Icons.BackArrow />
              </button>
            )}
          </div>

          {collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={styles.toggleBtn}
              style={{
                margin: "0 auto 1rem auto",
                transform: "rotate(180deg)",
              }}
              title="Expand sidebar"
            >
              <Icons.BackArrow />
            </button>
          )}

          {/* DESKTOP USER PROFILE & EMAIL CARD */}
          <div className={styles.desktopProfileCard} title={userEmail}>
            <div className={styles.desktopAvatar}>{userInitial}</div>
            {!collapsed && (
              <div className={styles.desktopUserInfo}>
                <div className={styles.desktopUserName}>{userName}</div>
                <div className={styles.desktopUserEmail}>{userEmail}</div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.activeItem : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={styles.icon}>
                    <Icon />
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className={`${styles.navItem} ${styles.logoutBtn}`}
              title={collapsed ? "Log Out" : undefined}
            >
              <span className={styles.icon}>
                <Icons.Logout />
              </span>
              {!collapsed && <span>Log Out</span>}
            </button>
          </nav>
        </div>
      </aside>

      {/* 2. MOBILE TOPBAR & DRAWER */}
      <div className={styles.mainWrapper}>
        <div className={styles.mobileTopbar}>
          <button
            className={styles.hamburgerBtn}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Icons.Menu />
          </button>
          <div style={{ fontWeight: 600, color: "var(--tan)" }}>
            Admin Panel
          </div>
          <div
            className={styles.avatar}
            style={{ width: 34, height: 34, fontSize: "0.9rem" }}
          >
            {userInitial}
          </div>
        </div>

        {/* Backdrop overlay */}
        <div
          className={`${styles.mobileOverlay} ${mobileOpen ? styles.open : ""}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Slide-out mobile menu */}
        <div
          className={`${styles.mobileDrawer} ${mobileOpen ? styles.open : ""}`}
        >
          <div className={styles.drawerHeader}>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>{userInitial}</div>
              <div>
                <div className={styles.userName}>{userName}</div>
                <div className={styles.userEmail}>{userEmail}</div>
              </div>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <Icons.BackArrow />
            </button>
          </div>

          <nav className={styles.mobileNavList}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.drawerItem} ${isActive ? styles.drawerItemActive : ""}`}
                >
                  <span className={styles.icon}>
                    <Icon />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button className={styles.mobileLogout} onClick={handleLogout}>
            <Icons.Logout />
            <span>Log Out</span>
          </button>
        </div>

        {/* Main page content */}
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
