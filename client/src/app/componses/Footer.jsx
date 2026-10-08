"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiArrowRight,
} from "react-icons/hi";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";
import styles from "./style/Footer.module.css";

const LOGO_URL =
  "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png";

export default function Footer() {
  const footerRef = useRef(null);

  // Mouse Spotlight Effect across Footer
  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    footerRef.current.style.setProperty("--mouse-x", `${x}px`);
    footerRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className={styles.footerWrapper}
    >
      {/* Background Interactive Spotlight Glow */}
      <div className={styles.spotlightGlow} />

      <div className={styles.container}>
        {/* 1. FLOATING QUICK REPAIR ESTIMATE / NEWSLETTER CARD */}
        <div className={styles.repairBanner}>
          <div className={styles.bannerText}>
            <span className={styles.cyanEyebrow}>
              FAST TURNAROUND &bull; GENUINE SPARES
            </span>
            <h3>Need Urgent Mobile Repair or Screen Change?</h3>
            <p>
              Get a instant diagnostic quote from our certified technicians in
              Tirupur.
            </p>
          </div>

          <div className={styles.bannerAction}>
            <a
              href="https://wa.me/917502634924?text=Hi%20Phonix%20Mobile,%20I%20need%20a%20repair%20quote"
              target="_blank"
              rel="noreferrer"
              className={styles.whatsappQuoteBtn}
            >
              <FaWhatsapp size={20} />
              <span>Chat on WhatsApp</span>
            </a>
            <a href="tel:+917502634924" className={styles.callNowBtn}>
              <HiOutlinePhone size={18} />
              <span>+91 7502634924</span>
            </a>
          </div>
        </div>

        {/* 2. MAIN FOOTER GRID */}
        <div className={styles.footerGrid}>
          {/* Column 1: Brand Bio & Status */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLogo}>
              <Image
                src={LOGO_URL}
                alt="Phonix Mobile"
                width={200}
                height={50}
                unoptimized
                className={styles.logoImg}
              />
            </Link>

            <p className={styles.brandBio}>
              Tirupur&apos;s premier multi-brand mobile repair workshop and
              premium accessories hub since 2016. High-precision chip-level
              service, original display replacements, and genuine components.
            </p>

            {/* Live Operational Status */}
            <div className={styles.statusBadge}>
              <span className={styles.pulseDot} />
              <span>Workshop Open &bull; Live Device Diagnostics</span>
            </div>

            {/* Social Icons */}
            <div className={styles.socialGroup}>
              <a
                href="https://wa.me/917502634924"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className={`${styles.socialBtn} ${styles.whatsappBtn}`}
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://www.instagram.com/custm_kart"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className={styles.socialBtn}
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Column 2: Repair Services */}
          <div className={styles.navCol}>
            <h4 className={styles.colTitle}>Repair Services</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/services/screen">
                  Original Display Replacement
                </Link>
              </li>
              <li>
                <Link href="/services/chip">Motherboard Chip-Level Repair</Link>
              </li>
              <li>
                <Link href="/services#battery">
                  Battery Health & Replacement
                </Link>
              </li>
              <li>
                <Link href="/services/water">Water Damage Restoration</Link>
              </li>
              <li>
                <Link href="/services/camera">Camera & Speaker Servicing</Link>
              </li>
              <li>
                <Link href="/services/charging">Charging Port & IC Fix</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Premium Accessories */}
          <div className={styles.navCol}>
            <h4 className={styles.colTitle}>Accessories Hub</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/product?category=chargers">
                  Fast Chargers & GaN Adapters
                </Link>
              </li>
              <li>
                <Link href="/product?category=cases">
                  Armor & Silicone Cases
                </Link>
              </li>
              <li>
                <Link href="/product?category=glass">
                  9H Gorilla Tempered Glass
                </Link>
              </li>
              <li>
                <Link href="/product?category=audio">
                  Bluetooth Earbuds & Neckbands
                </Link>
              </li>
              <li>
                <Link href="/product?category=cables">
                  Braided Type-C & Lightning Cables
                </Link>
              </li>
              <li>
                <Link href="/product?category=powerbanks">
                  High-Capacity Power Banks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Workshop & Location */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Workshop & Store</h4>

            <div className={styles.contactRow}>
              <HiOutlineLocationMarker className={styles.contactIcon} />
              <span>Periyar Colony, Tirupur, Tamil Nadu - 641652</span>
            </div>

            <div className={styles.contactRow}>
              <HiOutlinePhone className={styles.contactIcon} />
              <a href="tel:+917502634924">+91 7502634924</a>
            </div>

            <div className={styles.contactRow}>
              <HiOutlineMail className={styles.contactIcon} />
              <a href="mailto:custmkartphonixmobile@gmail.com">
                custmkartphonixmobile@gmail.com
              </a>
            </div>

            <div className={styles.contactRow}>
              <HiOutlineClock className={styles.contactIcon} />
              <span>Mon - Sun: 09:30 AM - 09:30 PM</span>
            </div>

            <div className={styles.certPill}>
              <span>⚡ 100% Genuine Parts & Service Warranty</span>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM COPYRIGHT BAR */}
        <div className={styles.bottomBar}>
          <p className={styles.copyText}>
            &copy; {new Date().getFullYear()} Phonix Mobile. All Rights
            Reserved. &ldquo;Quality is our validity.&rdquo;
          </p>

          <div className={styles.devCredit}>
            <span>Developed by</span>
            <a
              href="https://dharsanportfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.devLink}
            >
              Dharsan S
            </a>
            <span className={styles.divider}>|</span>
            <a href="tel:+919384428585" className={styles.devPhone}>
              <HiOutlinePhone size={14} /> 93844 28585
            </a>
          </div>
        </div>

        <div className={styles.bottomLinks}>
          <span>Periyar Colony, Tirupur</span>
          <span>&bull;</span>
          <Link href="/privacy">Privacy Policy</Link>
          <span>&bull;</span>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
