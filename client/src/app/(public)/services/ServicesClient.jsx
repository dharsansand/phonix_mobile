"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  HiArrowRight,
  HiArrowLeft,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiHome,
} from "react-icons/hi";
import styles from "./services.module.css";
import { useGetServiceQuery } from "../../store/api/serviceApi";

export const SERVICES_LIST = [
  {
    _id: "default-1",
    slug: "screen-glass-replacement",
    title: "Laser Screen & Glass Replacement",
    device: "iPhone 14 Pro Max",
    turnaround: "30 Mins",
    warranty: "90 Days Warranty",
    badge: "MOST POPULAR",
    beforeImg:
      "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790506334/service/mt9sx9ibfiniubxjqy1c.png",
    afterImg:
      "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790506338/service/epch0bm13zxlpazgbjec.png",
    desc: "Precision laser separation removes cracked outer glass while preserving 100% of your factory OLED display & True Tone colors.",
  },
];

// 🟢 Single Before & After Card with Pixel-Perfect Clip-Path Slider
function BeforeAfterCard({ service }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleSliderMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSliderPos(percentage);
  };

  const resolveImg = (img) => {
    if (!img)
      return "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800";
    if (Array.isArray(img)) return img[0];
    return typeof img === "object" ? img.url || "" : img;
  };

  const beforeUrl = resolveImg(service.beforeImg);
  const afterUrl = resolveImg(service.afterImg);

  const cleanSnippet = service.desc
    ? service.desc.replace(/<[^>]*>?/gm, "").trim()
    : "Precision diagnosis and OEM repair with warranty.";

  const targetSlug = service.slug || service._id;

  return (
    <div className={styles.caseCard}>
      {/* Top Meta */}
      <div className={styles.cardTopMeta}>
        <span className={styles.categoryBadge}>
          {service.badge || "VERIFIED REPAIR"}
        </span>
        <div className={styles.timeTag}>
          <HiOutlineClock size={15} />
          <span>{service.turnaround || "30 Mins"}</span>
        </div>
      </div>

      {/* 🟢 FULL IMAGE BEFORE & AFTER COMPARISON (CLIP-PATH) */}
      <div
        ref={containerRef}
        className={styles.imageBox}
        onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)}
        onTouchMove={handleSliderMove}
        onClick={handleSliderMove}
      >
        {/* 1. AFTER Image (Full underneath) */}
        <img
          src={afterUrl}
          alt={`${service.title} After`}
          className={styles.fullImg}
        />
        <span className={styles.afterBadge}>AFTER</span>

        {/* 2. BEFORE Image (100% aligned, clipped by sliderPos) */}
        <img
          src={beforeUrl}
          alt={`${service.title} Before`}
          className={styles.fullImg}
          style={{
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
            WebkitClipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
          }}
        />
        <span
          className={styles.beforeBadge}
          style={{ opacity: sliderPos > 15 ? 1 : 0 }}
        >
          BEFORE
        </span>

        {/* 3. Glowing Cyan Handle Line */}
        <div className={styles.sliderHandle} style={{ left: `${sliderPos}%` }}>
          <div className={styles.handleLine} />
          <div className={styles.handleKnob}>&#8596;</div>
        </div>

        {/* Device Label */}
        {service.device && (
          <span className={styles.deviceLabel}>Sample: {service.device}</span>
        )}
      </div>

      {/* Card Body */}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>
          <Link href={`/services/${targetSlug}`}>{service.title}</Link>
        </h3>

        <p className={styles.cardDesc}>
          {cleanSnippet.length > 130
            ? `${cleanSnippet.substring(0, 130)}...`
            : cleanSnippet}
        </p>

        <div className={styles.cardFooter}>
          <div className={styles.warrantyMeta}>
            <HiOutlineShieldCheck className={styles.shieldIcon} />
            <span>{service.warranty || "90 Days Warranty"}</span>
          </div>

          <Link
            href={`/services/${targetSlug}`}
            className={styles.viewDetailLink}
          >
            <span>View Full Details</span>
            <HiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesClient() {
  const { data: apiResponse = [], isLoading } = useGetServiceQuery();

  const servicesList = useMemo(() => {
    const list = Array.isArray(apiResponse)
      ? apiResponse
      : Array.isArray(apiResponse?.data)
        ? apiResponse.data
        : [];

    const activeItems = list.filter(
      (item) => item.isActive !== false && item.isDelete !== true,
    );

    return activeItems.length > 0 ? activeItems : SERVICES_LIST;
  }, [apiResponse]);

  return (
    <div className={styles.servicesPageWrapper}>
      <div className={styles.container}>
        {/* Top Breadcrumb Navigation */}
        <div className={styles.topNavBar}>
          <Link href="/" className={styles.backHomeBtn}>
            <HiArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <nav className={styles.breadcrumbTrail} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>
              <HiHome size={14} />
              <span>Home</span>
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbActive}>Services</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className={styles.headerBlock}>
          <span className={styles.eyebrow}>BEFORE & AFTER CASE STUDIES</span>
          <h1 className={styles.mainTitle}>Real Restorations. Real Results.</h1>
          <p className={styles.subTitle}>
            Drag the interactive slider on any card below to compare repair
            quality, or click the title to view complete lab procedures and
            pricing.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div
            style={{ textAlign: "center", padding: "4rem 0", color: "#00d2ff" }}
          >
            <p style={{ fontWeight: 700 }}>Loading Real Repair Cases...</p>
          </div>
        ) : (
          <div className={styles.casesGrid}>
            {servicesList.map((srv) => (
              <BeforeAfterCard key={srv._id || srv.slug} service={srv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
