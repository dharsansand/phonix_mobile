"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./style/WhyChooseUs.module.css";

const CATEGORIES = ["All", "Laser Screen", "Chip IC", "Battery"];

const TECH_CARDS = [
  {
    id: "screen",
    category: "Laser Screen",
    tag: "0.1MM SEPARATION",
    title: "Original Glass Separation",
    desc: "Crack-free glass restoration preserving your factory OLED panel, TrueTone calibration, and 120Hz touch response.",
    badge: "30-MIN TURNAROUND",
    visualType: "focus",
    whatsappText:
      "Hi Phonix Mobile, I need Screen Glass Separation for my phone.",
  },
  {
    id: "chip",
    category: "Chip IC",
    tag: "4K MICROSCOPE REWORK",
    title: "Motherboard Chip Lab",
    desc: "Precision BGA reballing stations and thermal imaging to revive water-damaged, dead, and short-circuited logic boards.",
    badge: "98% SUCCESS RATE",
    visualType: "focus",
    whatsappText:
      "Hi Phonix Mobile, I have a dead/water-damaged phone motherboard for diagnostics.",
  },
  {
    id: "battery",
    category: "Battery",
    tag: "OEM TESTED CELLS",
    title: "Certified Battery Health",
    desc: "High-density fresh cycle cells with written 90-day replacement warranty. Maximum backup, zero overheating.",
    badge: "100% HEALTH AUDIT",
    visualType: "battery",
    whatsappText:
      "Hi Phonix Mobile, I want to replace my phone battery with warranty.",
  },
];

export default function WhyChooseUs() {
  const [activeTab, setActiveTab] = useState("All");

  const visibleCards =
    activeTab === "All"
      ? TECH_CARDS
      : TECH_CARDS.filter((c) => c.category === activeTab);

  return (
    <section className={styles.scrolltideSection}>
      <div className={styles.container}>
        {/* Header Block */}
        <div className={styles.headerBlock}>
          <div className={styles.eyebrowBadge}>
            <span className={styles.pulseDot} />
            <span>PRECISION WORKSHOP STANDARDS</span>
          </div>

          <h2 className={styles.mainHeading}>One device at a time.</h2>

          <p className={styles.subHeading}>
            Not every repair is a simple part swap. At Phonix Mobile, every
            device undergoes optical microscope diagnosis, laser glass
            separation, and lab-grade IC rework in Periyar Colony, Tirupur.
          </p>

          {/* Quick Consultation Badge */}
          <div className={styles.consultBadge}>
            <span className={styles.badgeBolt}>⚡</span>
            <span>Why Phonix Mobile?</span>
            <a href="tel:+917502634924" className={styles.badgeLink}>
              Free Consultation &rarr;
            </a>
          </div>

          {/* Interactive Filter Pills */}
          <div className={styles.filterTrack}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`${styles.filterPill} ${
                  activeTab === cat ? styles.filterActive : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 🟢 SCROLLTIDE 3-DECK TECH CARDS */}
        <div className={styles.deckGrid}>
          {visibleCards.map((card) => (
            <div key={card.id} className={styles.deckCard}>
              {/* Top Neon Glow Beam (Scrolltide Signature) */}
              <div className={styles.topBeam} />

              {/* Inside Visual Preview Stage */}
              <div className={styles.previewStage}>
                <span className={styles.stageBadge}>{card.badge}</span>

                {card.visualType === "focus" && (
                  <div className={styles.focusContainer}>
                    <div className={styles.focusFrame}>
                      <span className={styles.bracket}>[</span>
                      <span className={styles.focusTarget}>Original OLED</span>
                      <span className={styles.bracket}>]</span>
                    </div>
                    <span className={styles.focusSubtitle}>
                      Touch Calibration Verified
                    </span>
                  </div>
                )}

                {card.visualType === "mesh" && (
                  <div className={styles.meshContainer}>
                    <div className={styles.circuitGrid} />
                    <div className={styles.pulseChip} />
                    <span className={styles.meshSubtitle}>
                      BGA Soldering Station Active
                    </span>
                  </div>
                )}

                {card.visualType === "battery" && (
                  <div className={styles.batteryContainer}>
                    <div className={styles.batteryRing}>
                      <span className={styles.batteryNumber}>100%</span>
                    </div>
                    <span className={styles.batterySubtitle}>
                      OEM Fresh Cycle Certified
                    </span>
                  </div>
                )}
              </div>

              {/* Card Text & CTA */}
              <div className={styles.cardBody}>
                <span className={styles.cardTag}>{card.tag}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>

                <div className={styles.cardActionRow}>
                  <a
                    href={`https://wa.me/917502634924?text=${encodeURIComponent(card.whatsappText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.ctaPill}
                  >
                    <FaWhatsapp size={15} />
                    <span>Book on WhatsApp</span>
                    <HiArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
