"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiArrowLeft,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiArrowRight,
  HiHome,
  HiChevronRight,
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./detail.module.css";
// 🟢 2. RTK Query Hook
import { useGetServiceBySlugQuery } from "../../../store/api/serviceApi";

export default function ServiceDetailClient({ slug }) {
  const router = useRouter();

  // Fetch real data from NestJS by slug
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useGetServiceBySlugQuery(slug);
  const service = apiResponse?.data || apiResponse || {};

  // Interactive Clip-Path Before/After Slider state (0 to 100%)
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

  const resolveImg = (img, fallback) => {
    if (!img) return fallback;
    if (Array.isArray(img)) return img[0];
    return typeof img === "object" ? img.url || fallback : img;
  };

  const beforeUrl = resolveImg(
    service.beforeImg,
    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800",
  );
  const afterUrl = resolveImg(
    service.afterImg,
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
  );

  if (isLoading) {
    return (
      <div className={styles.loadingBox}>
        <div className={styles.spinner} />
        <p>Loading Repair Case Details...</p>
      </div>
    );
  }

  if (isError || !service.title) {
    return (
      <div className={styles.loadingBox}>
        <h2>Service Case Not Found</h2>
        <p>We couldn&apos;t retrieve the requested repair service.</p>
        <Link href="/services" className={styles.backHomeBtn}>
          Back to All Services
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailWrapper}>
      <div className={styles.container}>
        {/* Top Breadcrumb Navigation */}
        <div className={styles.topNav}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <HiArrowLeft size={16} />
            <span>Back</span>
          </button>

          <nav className={styles.breadcrumbTrail} aria-label="Breadcrumb">
            <Link href="/" className={styles.crumbLink}>
              <HiHome size={14} /> Home
            </Link>
            <HiChevronRight size={13} className={styles.crumbSep} />
            <Link href="/services" className={styles.crumbLink}>
              Services
            </Link>
            <HiChevronRight size={13} className={styles.crumbSep} />
            <span className={styles.activeCrumb}>{service.title}</span>
          </nav>
        </div>

        {/* 🟢 Header Info */}
        <div className={styles.header}>
          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>
              {service.badge || "VERIFIED REPAIR"}
            </span>
            <span className={styles.deviceBadge}>📱 {service.device}</span>
            <span className={styles.warrantyBadge}>
              🛡️ {service.warranty || "90 Days Warranty"}
            </span>
          </div>

          <h1 className={styles.detailTitle}>{service.title}</h1>
        </div>

        {/* 🟢 Interactive Full-Size Before & After Comparison Stage */}
        <div className={styles.sliderCard}>
          <div className={styles.sliderTopText}>
            <h3>Visual Inspection: {service.device}</h3>
            <span>
              &larr; Drag slider left or right to inspect finish &rarr;
            </span>
          </div>

          <div
            ref={containerRef}
            className={styles.comparisonStage}
            onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)}
            onTouchMove={handleSliderMove}
            onClick={handleSliderMove}
          >
            {/* 1. AFTER Image (Restored) */}
            <img
              src={afterUrl}
              alt={`${service.title} After`}
              className={styles.fullImg}
            />
            <span className={styles.afterLabel}>AFTER: Restored</span>

            {/* 2. BEFORE Image (Damaged - Clipped by sliderPos) */}
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
              className={styles.beforeLabel}
              style={{ opacity: sliderPos > 15 ? 1 : 0 }}
            >
              BEFORE: Damaged
            </span>

            {/* 3. Glowing Divider Handle */}
            <div
              className={styles.sliderHandle}
              style={{ left: `${sliderPos}%` }}
            >
              <div className={styles.glowLine} />
              <div className={styles.handleKnob}>&#8596;</div>
            </div>
          </div>
        </div>

        {/* 🟢 3-Column Specifications Box */}
        <div className={styles.specsGrid}>
          <div className={styles.specBox}>
            <span className={styles.boxTitle}>Turnaround Time</span>
            <strong className={styles.boxValue}>
              {service.turnaround || "30 Mins"}
            </strong>
            <p>On-the-spot express repair at our Periyar Colony workshop.</p>
          </div>

          <div className={styles.specBox}>
            <span className={styles.boxTitle}>Warranty Period</span>
            <strong className={styles.boxValue}>
              {service.warranty || "90 Days Warranty"}
            </strong>
            <p>Direct replacement guarantee on all installed spare parts.</p>
          </div>

          <div className={styles.specBox}>
            <span className={styles.boxTitle}>Data Safety</span>
            <strong className={styles.boxValue}>100% Preserved</strong>
            <p>Your photos, chats, and apps remain completely untouched.</p>
          </div>
        </div>

        {/* 🟢 Rich Text Description from MongoDB */}
        {service.desc && (
          <div className={styles.descCard}>
            <h3 className={styles.descSectionTitle}>
              Lab Procedure & Technical Overview
            </h3>
            <div
              className={styles.htmlContent}
              dangerouslySetInnerHTML={{ __html: service.desc }}
            />
          </div>
        )}

        {/* 🟢 Action WhatsApp Booking Card */}
        <div className={styles.bookingCard}>
          <div>
            <h3>Need this repair done on your {service.device}?</h3>
            <p>
              Connect directly with our master technicians in Tirupur for slot
              booking & spare part reservation.
            </p>
          </div>

          <a
            href={`https://wa.me/917502634924?text=${encodeURIComponent(
              `Hi Phonix Mobile, I saw your case study for ${service.title} (${service.device}) and want to book a repair.`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className={styles.whatsappBookingBtn}
          >
            <FaWhatsapp size={20} />
            <span>Book on WhatsApp</span>
            <HiArrowRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}
