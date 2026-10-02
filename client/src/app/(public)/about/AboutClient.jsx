"use client";

import React from "react";
import Link from "next/link";
import {
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineChip,
  HiHome,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineEye,
  HiOutlineLightningBolt,
  HiOutlineCubeTransparent,
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./about.module.css";

const LAB_EQUIPMENT = [
  {
    icon: <HiOutlineLightningBolt size={26} />,
    title: "0.1mm  Separation Station",
    tag: "GLASS RESTORATION",
    desc: "Automated zero-heat  beam cleanly cuts shattered glass while preserving 100% of your factory-original OLED display panel.",
  },
  {
    icon: <HiOutlineEye size={26} />,
    title: "4K Stereo Optical Microscopes",
    tag: "MICRO-SOLDERING",
    desc: "High-magnification binocular optics allow technicians to inspect and re-solder microscopic copper traces thinner than a human hair.",
  },
  {
    icon: <HiOutlineCubeTransparent size={26} />,
    title: "Infrared Thermal Imaging",
    tag: "SHORT-CIRCUIT DETECTION",
    desc: "Instantly spots hidden heating anomalies, burnt capacitors, and shorted power ICs on dead and liquid-damaged motherboards.",
  },
  {
    icon: <HiOutlineChip size={26} />,
    title: "EEPROM Data Programmers",
    tag: "TRUETONE & CALIBRATION",
    desc: "Reads and copies encryption codes to retain Apple True Tone, Face ID sensors, and battery health status without system warning popups.",
  },
];

const MILESTONES = [
  {
    year: "2016",
    title: "Humble Beginnings in Tirupur",
    desc: "Started in Periyar Colony with a single workbench, basic soldering tools, and an uncompromising motto: 'Quality is our validity'.",
  },
  {
    year: "2019",
    title: "Upgrading to Chip-Level Lab",
    desc: "Invested in 4K stereo optical microscopes and BGA reballing stations to revive dead motherboards and liquid-damaged devices.",
  },
  {
    year: "2021",
    title: "Glass Separation & Spares Hub",
    desc: "Introduced zero-heat glass cutting to preserve original factory OLED panels and launched certified accessories retail.",
  },
  {
    year: "Today",
    title: "50,000+ Restorations & Counting",
    desc: "Recognized as Tirupur's No.1 trusted smartphone service center with a verified 4.9-star customer rating.",
  },
];

const VALUES = [
  {
    icon: <HiOutlineShieldCheck size={28} />,
    title: "Zero Data Compromise",
    desc: "Your photos, WhatsApp chats, and sensitive banking data remain 100% private. We never factory-reset hardware repairs.",
  },
  {
    icon: <HiOutlineSparkles size={28} />,
    title: "100% Genuine Tested Spares",
    desc: "We exclusively source tested OEM display combos, high-density fresh battery cells, and original charging flex ribbons.",
  },
  {
    icon: <HiOutlineClock size={28} />,
    title: "30-Minute Turnaround",
    desc: "We respect your time. Common screen, speaker, and battery replacements are performed on-the-spot while you wait.",
  },
  {
    icon: <HiOutlineChip size={28} />,
    title: "Transparent 'No Fix, No Fee'",
    desc: "Free initial diagnostics. If our master technicians cannot rescue your device, you pay zero inspection fees.",
  },
];

export default function AboutClient() {
  return (
    <div className={styles.aboutPageWrapper}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.topNav}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.crumbLink}>
              <HiHome size={14} />
              <span>Home</span>
            </Link>
            <span className={styles.crumbSep}>/</span>
            <span className={styles.activeCrumb}>About Us</span>
          </nav>
        </div>

        {/* Hero Story */}
        <section className={styles.heroSection}>
          <span className={styles.heroBadge}>
            ESTABLISHED 2016 &bull; PERIYAR COLONY, TIRUPUR
          </span>
          <h1 className={styles.heroTitle}>
            Engineering Trust. <br />
            Reviving Connectivity.
          </h1>
          <p className={styles.heroSub}>
            At Phonix Mobile, we believe a broken phone shouldn&apos;t mean
            losing your valuable data or spending a fortune on a brand-new
            device. We combine surgical precision, lab-grade micro-soldering,
            and honest warranties to bring dead devices back to life.
          </p>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>50K+</span>
              <span className={styles.statLabel}>Devices Revived</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <span className={styles.statNumber}>9+</span>
              <span className={styles.statLabel}>Years in Tirupur</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <span className={styles.statNumber}>FREE</span>
              <span className={styles.statLabel}>Gift Included</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <span className={styles.statNumber}>4.9 ★</span>
              <span className={styles.statLabel}>Google Rating</span>
            </div>
          </div>
        </section>

        {/* Diagnostic Lab Section */}
        <section className={styles.equipmentSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTagCyan}>
              WORKSHOP INFRASTRUCTURE
            </span>
            <h2 className={styles.sectionTitle}>Inside Our Diagnostic Lab</h2>
            <p className={styles.sectionSubText}>
              We don&apos;t use guesswork. Every repair is performed using
              calibrated optical instruments and specialized hardware stations.
            </p>
          </div>

          <div className={styles.equipmentGrid}>
            {LAB_EQUIPMENT.map((eq, i) => (
              <div key={i} className={styles.equipmentCard}>
                <div className={styles.equipmentIconBox}>{eq.icon}</div>
                <span className={styles.equipmentTag}>{eq.tag}</span>
                <h3 className={styles.equipmentTitle}>{eq.title}</h3>
                <p className={styles.equipmentDesc}>{eq.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Repair Ethics */}
        <section className={styles.valuesSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>OUR REPAIR ETHICS</span>
            <h2 className={styles.sectionTitle}>Built on Absolute Integrity</h2>
            <p className={styles.sectionSubText}>
              Why thousands of smartphone owners across Tirupur trust Phonix
              Mobile with their primary devices.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {VALUES.map((val, idx) => (
              <div key={idx} className={styles.valueCard}>
                <div className={styles.valueIcon}>{val.icon}</div>
                <h3 className={styles.valueTitle}>{val.title}</h3>
                <p className={styles.valueDesc}>{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className={styles.timelineSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>OUR JOURNEY</span>
            <h2 className={styles.sectionTitle}>From 2016 to Present</h2>
            <p className={styles.sectionSubText}>
              How continuous investment in cutting-edge diagnostics turned us
              into Tirupur&apos;s premier mobile lab.
            </p>
          </div>

          <div className={styles.timelineList}>
            {MILESTONES.map((item, idx) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <h4 className={styles.timelineTitle}>{item.title}</h4>
                  <p className={styles.timelineDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Workshop Contact CTA */}
        <section className={styles.ctaCard}>
          <div className={styles.ctaLeft}>
            <span className={styles.ctaBadge}>VISIT OUR WORKSHOP</span>
            <h3 className={styles.ctaTitle}>
              Experience the Difference in Person
            </h3>
            <p className={styles.ctaText}>
              Drop by our service center in Periyar Colony, Tirupur for an
              on-the-spot free diagnosis and estimate.
            </p>
            <div className={styles.locationMeta}>
              <HiOutlineLocationMarker className={styles.locIcon} />
              <span>
                Periyar Colony, Tirupur, Tamil Nadu &bull; Mon - Sun: 9:30 AM -
                9:30 PM
              </span>
            </div>
          </div>

          <div className={styles.ctaRight}>
            <a
              href="https://wa.me/917502634924?text=Hi%20Phonix%20Mobile,%20I%20want%20to%20visit%20your%20workshop"
              target="_blank"
              rel="noreferrer"
              className={styles.whatsappBtn}
            >
              <FaWhatsapp size={20} />
              <span>Chat with Technician</span>
            </a>
            <a href="tel:+917502634924" className={styles.callBtn}>
              <HiOutlinePhone size={18} />
              <span>+91 7502634924</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
