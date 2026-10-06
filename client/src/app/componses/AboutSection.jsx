"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import styles from "./style/AboutSection.module.css";

// 🟢 3 Core Service Pillars
const REPAIR_PILLARS = [
  {
    title: "100% Genuine OEM Spares",
    desc: "Original touch glass, displays, batteries, and charging ports backed by warranty.",
    icon: "🛡️",
  },
  {
    title: "Advanced Micro-Soldering Lab",
    desc: "High-magnification microscopes for chip-level BGA repairs, IC replacements, and water damage.",
    icon: "🔬",
  },
  {
    title: "30-Minute Express Turnaround",
    desc: "On-the-spot screen, speaker, and battery changes so you are never left disconnected.",
    icon: "⚡",
  },
];

// 🟢 Interactive Workshop Tabs
const LAB_TABS = {
  screen: {
    label: "Screen Lab",
    badge: "ORIGINAL COMBO",
    image:
      "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790928327/banners/pp6yv5jh5ki9ln2bd7y8.jpg",
    desc: "Precision Laser Glass Separation & OEM Touch Assemblies",
  },
  chip: {
    label: "Chip Lab",
    badge: "IC REPAIR",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80",
    desc: "Motherboard Reballing & Micro-soldering Diagnostics",
  },
  accessories: {
    label: "Gear Hub",
    badge: "PREMIUM ACCESSORIES",
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&auto=format&fit=crop&q=80",
    desc: "65W GaN Fast Chargers, Armor Cases & Audio Gear",
  },
};

export default function AboutSection() {
  const cardRef = useRef(null);
  const [activeTab, setActiveTab] = useState("screen");

  // React Bits Mouse Spotlight Tracker
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const currentLab = LAB_TABS[activeTab];

  return (
    <section className={styles.aboutWrapper}>
      <div className={styles.container}>
        {/* LEFT COLUMN: INTERACTIVE DIAGNOSTIC LAB SHOWCASE */}
        <div className={styles.visualCol}>
          {/* Ambient Cyan Halo Glow */}
          <div className={styles.ambientBeam} />

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className={styles.spotlightCard}
          >
            {/* Dynamic Spotlight Glow */}
            <div className={styles.spotlightEffect} />

            {/* Top Badge Stamp */}
            <div className={styles.cardHeader}>
              <div className={styles.stamp}>
                <span className={styles.pulseDot} />
                <span>PHONIX WORKSHOP LAB</span>
              </div>
              <span className={styles.serialPill}>SINCE 2016</span>
            </div>

            {/* Central Layered Tech Image Stage */}
            <div className={styles.stageFrame}>
              <div className={styles.haloRing} />
              <img
                src={currentLab.image}
                alt={currentLab.label}
                className={styles.stageImage}
              />
              <div className={styles.imageOverlayBadge}>{currentLab.badge}</div>
            </div>

            {/* Interactive Lab Selector Tabs */}
            <div className={styles.tabSelector}>
              {Object.keys(LAB_TABS).map((key) => (
                <button
                  key={key}
                  className={`${styles.tabBtn} ${activeTab === key ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  {LAB_TABS[key].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BRAND STORY & PILLARS */}
        <div className={styles.contentCol}>
          <div className={styles.eyebrow}>
            <span className={styles.gem}>⚡</span>
            <span>NO.1 MOBILE SERVICE & ACCESSORIES</span>
          </div>

          <h2 className={styles.mainTitle}>
            Master-Level Engineering & <br />
            Flawless Device Restorations.
          </h2>

          <p className={styles.leadText}>
            Since 2016, Phonix Mobile has stood by our promise: &ldquo;Quality
            is our validity.&rdquo; From delicate iPhone OLED replacements to
            dead-device motherboard chip reballing, our master technicians
            ensure your device leaves our workshop operating like brand new.
          </p>

          {/* 3 Pillars Grid */}
          <div className={styles.pillarsGrid}>
            {REPAIR_PILLARS.map((pillar, idx) => (
              <div key={idx} className={styles.pillarCard}>
                <div className={styles.pillarIcon}>{pillar.icon}</div>
                <div>
                  <h4 className={styles.pillarTitle}>{pillar.title}</h4>
                  <p className={styles.pillarDesc}>{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Counters & Action */}
          <div className={styles.footerRow}>
            <Link href="/about" className={styles.primaryButton}>
              <span>Explore Workshop & Story</span>
              <HiArrowRight className={styles.btnArrow} />
            </Link>

            <div className={styles.statsSummary}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>50K+</span>
                <span className={styles.statLabel}>Devices Fixed</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>9+</span>
                <span className={styles.statLabel}>Years of Trust</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
