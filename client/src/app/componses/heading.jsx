"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../store/authSlice";
import styles from "./style/heading.module.css";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/product" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const LOGO_URL =
  "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [currentUser, setCurrentUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);

  const reduxUser = useSelector((state) => state.auth?.user);

  useEffect(() => {
    try {
      if (reduxUser) {
        setCurrentUser(reduxUser);
      } else {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        setCurrentUser(storedUser);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  }, [reduxUser, pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const syncCounts = useCallback(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const totalCartQty = Array.isArray(cart)
        ? cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
        : 0;
      setCartCount(totalCartQty);

      const wishlist = JSON.parse(
        localStorage.getItem("wishlistItems") || "[]",
      );
      setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    syncCounts();
    window.addEventListener("storage", syncCounts);
    window.addEventListener("cartUpdated", syncCounts);
    window.addEventListener("wishlistUpdated", syncCounts);

    return () => {
      window.removeEventListener("storage", syncCounts);
      window.removeEventListener("cartUpdated", syncCounts);
      window.removeEventListener("wishlistUpdated", syncCounts);
    };
  }, [syncCounts, pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logOut());
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  return (
    <header
      className={`${styles.headerWrapper} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.navBar}>
        {/* 1. LOGO ON LEFT */}
        <Link href="/" className={styles.brandLogo}>
          <Image
            src={LOGO_URL}
            alt="Phonix Mobile Service Center, mobile repair in Tiruppur"
            width={170}
            height={46}
            unoptimized
            priority
            sizes="170px"
            className={styles.logoImg}
          />
        </Link>

        {/* 2. NAVIGATION LINKS IN CENTER */}
        <nav className={styles.navLinks}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.activeNavItem : ""}`}
              >
                <span>{item.name}</span>
                {isActive && <span className={styles.activeDot} />}
              </Link>
            );
          })}
        </nav>

        {/* 3. ACTIONS ON RIGHT */}
        <div className={styles.rightActions}>
          {/* Quick Call */}
          <a href="tel:+917502634924" className={styles.callBtn}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>+91 7502634924</span>
          </a>

          {/* Search */}
          <button
            className={styles.actionBtn}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Cart */}
          <Link href="/cart" className={styles.actionBtn} aria-label="Cart">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {/* {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>} */}
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={styles.actionBtn}
            aria-label="Wishlist"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {/* {wishlistCount > 0 && (
              <span className={styles.badge}>{wishlistCount}</span>
            )} */}
          </Link>

          {/* User Profile */}
          <div ref={userMenuRef} style={{ position: "relative" }}>
            {currentUser ? (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User profile"
              >
                <span className={styles.avatarLetter}>
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                className={styles.actionBtn}
                aria-label="Sign In"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}

            {/* Dropdown */}
            {currentUser && isUserMenuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownUser}>
                  <div className={styles.dropdownAvatar}>
                    {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className={styles.dropdownName}>
                      {currentUser.name}
                    </div>
                    <div className={styles.dropdownEmail}>
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <div className={styles.dropdownLinks}>
                  <Link
                    href="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className={styles.dropdownItem}
                  >
                    <span>📦 My Orders</span>
                    <span>&rarr;</span>
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsUserMenuOpen(false)}
                    className={styles.dropdownItem}
                  >
                    <span>🛍️ Cart ({cartCount})</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className={styles.dropdownItem}
                  >
                    <span>❤️ Wishlist ({wishlistCount})</span>
                  </Link>
                </div>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`${styles.mobileToggle} ${isMobileOpen ? styles.toggleOpen : ""}`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* SEARCH OVERLAY */}
      <div
        className={`${styles.searchBar} ${isSearchOpen ? styles.searchOpen : ""}`}
      >
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search mobile services, screen repair, batteries, accessories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className={styles.closeSearch}
          >
            ✕
          </button>
        </form>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`${styles.backdrop} ${isMobileOpen ? styles.backdropActive : ""}`}
        onClick={() => setIsMobileOpen(false)}
      />
      <aside
        className={`${styles.drawer} ${isMobileOpen ? styles.drawerOpen : ""}`}
      >
        <div className={styles.drawerHeader}>
          <Image
            src={LOGO_URL}
            alt="Phonix Mobile"
            width={140}
            height={40}
            unoptimized
            className={styles.drawerLogo}
          />
          <button
            onClick={() => setIsMobileOpen(false)}
            className={styles.closeBtn}
          >
            ✕
          </button>
        </div>

        <nav className={styles.drawerLinks}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`${styles.drawerItem} ${pathname === item.href ? styles.drawerActive : ""}`}
            >
              <span>{item.name}</span>
              <span>&rarr;</span>
            </Link>
          ))}
        </nav>

        <div className={styles.drawerFooter}>
          <a href="tel:+917502634924" className={styles.drawerPhone}>
            📞 +91 7502634924
          </a>
          <p>📍 Periyar Colony, Tirupur</p>
        </div>
      </aside>
    </header>
  );
}
