"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./style/Banner.module.css";
import { useGetFontBannerQuery } from "../store/api/bannerApi";

// 🟢 Phonix Mobile High-Impact Offer Banners
const FALLBACK_BANNERS = [
  {
    _id: "offer-1",
    theme: "cyan",
    offerTag: "🔥 SPECIAL WORKSHOP OFFER",
    offerBadge: "FREE TEMPERED GLASS",
    title: "EXPERT SCREEN REPLACEMENT",
    highlight: "WITH 90-DAY WARRANTY",
    content:
      "Original touch & display combo replacement in under 30 minutes. Get complimentary 9H tempered glass installation on every screen repair today!",
    banner: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&auto=format&fit=crop&q=80",
    ],
  },
  {
    _id: "offer-2",
    theme: "orange",
    offerTag: "⚡ ADVANCED DIAGNOSTICS",
    offerBadge: "FLAT 20% OFF",
    title: "CHIP-LEVEL MOTHERBOARD",
    highlight: "IC & WATER DAMAGE REPAIR",
    content:
      "Dead phone diagnostics, charging port IC replacements, and water damage recovery by master technicians using state-of-the-art microscope stations.",
    banner: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    ],
    features: [
      "🔬 Micro-Soldering Station",
      "💧 Water Damage Recovery",
      "✅ No Fix No Fee Policy",
    ],
    whatsappMsg:
      "Hi Phonix Mobile, I need Chip-Level Motherboard diagnostics for my phone.",
  },
  {
    _id: "offer-3",
    theme: "magenta",
    offerTag: "🎁 FESTIVE ACCESSORIES DEAL",
    offerBadge: "BUY 1 GET 1 AT 30% OFF",
    title: "PREMIUM ACCESSORIES",
    highlight: "CHARGERS, CASES & AUDIO",
    content:
      "Upgrade your phone gear with military-grade shockproof cases, GaN fast chargers, ultra-durable braided cables, and deep-bass wireless earbuds.",
    banner: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1200&auto=format&fit=crop&q=80",
    ],
    features: [
      "⚡ 65W GaN Fast Chargers",
      "🛡️ Military Drop-Test Cases",
      "🎵 Bass Boost Earbuds",
    ],
    whatsappMsg:
      "Hi Phonix Mobile, I want to inquire about phone accessories & fast chargers.",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const bannerCardRef = useRef(null);

  // RTK Query API Hook
  const { data: apiResponse, isLoading } = useGetFontBannerQuery();

  const activeBanners = React.useMemo(() => {
    const rawList = Array.isArray(apiResponse)
      ? apiResponse
      : Array.isArray(apiResponse?.data)
        ? apiResponse.data
        : Array.isArray(apiResponse?.banner)
          ? apiResponse.banner
          : [];

    const filtered = rawList.filter(
      (item) => item.Active !== false && item.isdelete !== true,
    );

    return filtered.length > 0 ? filtered : FALLBACK_BANNERS;
  }, [apiResponse]);

  const length = activeBanners.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  }, [length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  }, [length]);

  // 🟢 React Bits Cursor Tracking Spotlight
  const handleMouseMove = (e) => {
    if (!bannerCardRef.current) return;
    const rect = bannerCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    bannerCardRef.current.style.setProperty("--mouse-x", `${x}px`);
    bannerCardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  useEffect(() => {
    if (isPaused || length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, length, current]);

  if (isLoading) {
    return (
      <section className={styles.fullBannerSection}>
        <div className={styles.bannerCard} style={{ minHeight: "560px" }}>
          <p style={{ margin: "auto", color: "#00d2ff", fontWeight: 700 }}>
            Loading Phonix Mobile Offers...
          </p>
        </div>
      </section>
    );
  }

  if (activeBanners.length === 0) return null;

  const currentItem = activeBanners[current];

  const imageUrl =
    (Array.isArray(currentItem?.banner) &&
    typeof currentItem.banner[0] === "string"
      ? currentItem.banner[0]
      : currentItem?.banner?.[0]?.img || currentItem?.banner?.[0]?.url) ||
    FALLBACK_BANNERS[0].banner[0];

  const cleanContent = currentItem?.content
    ? currentItem.content.replace(/^"/, "")
    : "";

  const features = currentItem?.features || [
    "⚡ Express Repair",
    "🛡️ Spares Warranty",
    "📍 Periyar Colony, Tirupur",
  ];

  return (
    <section
      className={styles.fullBannerSection}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem._id || current}
          className={`${styles.bannerSlide} ${styles[currentItem.theme || "cyan"]}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Main Card with Spotlight */}
          <div
            ref={bannerCardRef}
            onMouseMove={handleMouseMove}
            className={styles.bannerCard}
          >
            {/* React Bits Interactive Mouse Spotlight */}
            <div className={styles.spotlight} />
            <div className={styles.ambientNeonGlow} />

            {/* Left Content Column */}
            <div className={styles.leftCol}>
              {/* Promotional Offer Tag */}
              <div className={styles.offerBadgeWrapper}>
                <span className={styles.pulseDot} />
                <span className={styles.offerTagText}>
                  {currentItem.offerTag || "EXCLUSIVE WORKSHOP DEAL"}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className={styles.mainTitle}>
                {currentItem.title}
                {currentItem.highlight && (
                  <span className={styles.highlightText}>
                    {" "}
                    {currentItem.highlight}
                  </span>
                )}
              </h1>

              <p className={styles.description}>{cleanContent}</p>

              {/* Service Feature Highlights */}
              <div className={styles.featurePills}>
                {features.map((feat, i) => (
                  <span key={i} className={styles.featurePill}>
                    {feat}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className={styles.actionRow}>
                {/* WhatsApp Instant Booking */}
                <a
                  href={`https://wa.me/917502634924?text=${encodeURIComponent(
                    currentItem.whatsappMsg ||
                      "Hi Phonix Mobile, I need a repair estimate.",
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.primaryBtn}
                >
                  <FaWhatsapp size={19} />
                  <span>CLAIM OFFER ON WHATSAPP</span>
                  <HiArrowRight className={styles.btnArrow} />
                </a>

                {/* Direct Call */}
                <a href="tel:+917502634924" className={styles.secondaryBtn}>
                  📞 CALL: +91 7502634924
                </a>
              </div>
            </div>

            {/* Right Graphic Showcase */}
            <div className={styles.rightCol}>
              {/* Floating Discount Tag */}
              {currentItem.offerBadge && (
                <motion.div
                  className={styles.floatingDiscountBadge}
                  initial={{ scale: 0.8, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <span className={styles.discountSmall}>EXCLUSIVE</span>
                  <span className={styles.discountBig}>
                    {currentItem.offerBadge}
                  </span>
                </motion.div>
              )}

              {/* Rotating Circuit Rings */}
              <div className={styles.cyberRingOuter} />
              <div className={styles.cyberRingInner} />

              {/* Tech Showcase Frame */}
              <div className={styles.imageFrame}>
                <img
                  src={imageUrl}
                  alt={currentItem.title || "Phonix Mobile"}
                  className={styles.productImg}
                />
                <div className={styles.screenOverlay} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {length > 1 && (
        <div className={styles.controlsRow}>
          <button
            onClick={prevSlide}
            className={styles.navBtn}
            aria-label="Previous"
          >
            <HiChevronLeft size={22} />
          </button>

          <div className={styles.dotsPagination}>
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.dot} ${idx === current ? styles.activeDot : ""}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className={styles.navBtn}
            aria-label="Next"
          >
            <HiChevronRight size={22} />
          </button>
        </div>
      )}
    </section>
  );
}
