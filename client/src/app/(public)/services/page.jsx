"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  HiArrowRight,
  HiArrowLeft,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiHome,
} from "react-icons/hi";
import styles from "./services.module.css";

// 🟢 Services Data with Slugs & Before/After Images
export const SERVICES_LIST = [
  {
    slug: "screen-glass-replacement",
    title: "Laser Screen & Glass Replacement",
    device: "iPhone 14 Pro Max",
    turnaround: "30 Mins",
    warranty: "90 Days Warranty",
    desc: "Precision laser separation removes cracked outer glass while preserving 100% of your factory OLED display & True Tone colors.",
    beforeImg:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    afterImg:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80",
    badge: "MOST POPULAR",
  },
  {
    slug: "motherboard-chip-repair",
    title: "Motherboard Chip-Level & IC Repair",
    device: "Samsung Galaxy S22 Ultra",
    turnaround: "2 - 4 Hours",
    warranty: "60 Days Warranty",
    desc: "4K optical microscope diagnostics and BGA reballing stations to revive dead phones, power loop errors, and short circuits.",
    beforeImg:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    afterImg:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    badge: "LAB GRADE",
  },
  {
    slug: "battery-replacement",
    title: "Certified Battery Replacement",
    device: "OnePlus 11 5G",
    turnaround: "25 Mins",
    warranty: "90 Days Warranty",
    desc: "Fresh-cycle high-density lithium polymer cells with original capacity specs. Eliminates rapid battery drain and heating.",
    beforeImg:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    afterImg:
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
    badge: "OEM CELLS",
  },
  {
    slug: "water-damage-restoration",
    title: "Water & Liquid Damage Restoration",
    device: "Vivo X90 Pro",
    turnaround: "Same Day",
    warranty: "Data Guarantee",
    desc: "Ultrasonic chemical de-oxidation to clean mineral corrosion, prioritize memory chips, and salvage all your photos and data.",
    beforeImg:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    afterImg:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80",
    badge: "DATA RESCUE",
  },
];

// Single Before & After Card with Interactive Slider
function BeforeAfterCard({ service }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [boxWidth, setBoxWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setBoxWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setBoxWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSliderMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <div className={styles.caseCard}>
      {/* Top Meta */}
      <div className={styles.cardTopMeta}>
        <span className={styles.categoryBadge}>{service.badge}</span>
        <div className={styles.timeTag}>
          <HiOutlineClock size={15} />
          <span>{service.turnaround}</span>
        </div>
      </div>

      {/* Draggable Slider Stage */}
      <div
        ref={containerRef}
        className={styles.imageBox}
        onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)}
        onTouchMove={handleSliderMove}
        onClick={handleSliderMove}
      >
        {/* AFTER Layer */}
        <div className={styles.afterLayer}>
          <img
            src={service.afterImg}
            alt={`${service.title} After`}
            className={styles.caseImg}
          />
          <span className={styles.afterBadge}>AFTER</span>
        </div>

        {/* BEFORE Layer */}
        <div className={styles.beforeLayer} style={{ width: `${sliderPos}%` }}>
          <img
            src={service.beforeImg}
            alt={`${service.title} Before`}
            className={styles.caseImgBefore}
            style={{ width: boxWidth ? `${boxWidth}px` : "100%" }}
          />
          <span className={styles.beforeBadge}>BEFORE</span>
        </div>

        {/* Slider Handle */}
        <div className={styles.sliderHandle} style={{ left: `${sliderPos}%` }}>
          <div className={styles.handleLine} />
          <div className={styles.handleKnob}>&#8596;</div>
        </div>

        <span className={styles.deviceLabel}>Sample: {service.device}</span>
      </div>

      {/* Card Body */}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>
          <Link href={`/services/${service.slug}`}>{service.title}</Link>
        </h3>
        <p className={styles.cardDesc}>{service.desc}</p>

        <div className={styles.cardFooter}>
          <div className={styles.warrantyMeta}>
            <HiOutlineShieldCheck className={styles.shieldIcon} />
            <span>{service.warranty}</span>
          </div>

          <Link
            href={`/services/${service.slug}`}
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

export default function ServicesPage() {
  return (
    <div className={styles.servicesPageWrapper}>
      <div className={styles.container}>
        {/* 🟢 TOP BREADCRUMB & BACK NAVIGATION BAR */}
        <div className={styles.topNavBar}>
          <Link href="/" className={styles.backHomeBtn}>
            <HiArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          {/* Breadcrumb: Home / Services */}
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

        {/* Before & After Cards Grid */}
        <div className={styles.casesGrid}>
          {SERVICES_LIST.map((srv) => (
            <BeforeAfterCard key={srv.slug} service={srv} />
          ))}
        </div>
      </div>
    </div>
  );
}
