"use client";

import React from "react";
import styles from "./style/loader.module.css";

export default function Loader() {
  return (
    <div className={styles.loaderWrapper}>
      {/* Background Ambient Neon Glows */}
      <div className={styles.glowCyan} />
      <div className={styles.glowOrange} />

      <div className={styles.loaderCore}>
        {/* Rotating 16-tick Neon Circuit HUD Ring */}
        <div className={styles.haloRing}>
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className={styles.haloTick}
              style={{ transform: `rotate(${i * 22.5}deg)` }}
            />
          ))}
        </div>

        {/* High-Tech Smartphone & Repair Wrench SVG */}
        <svg className={styles.techIcon} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d2ff" />
              <stop offset="100%" stopColor="#0080ff" />
            </linearGradient>

            <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb703" />
              <stop offset="100%" stopColor="#ff9f1c" />
            </linearGradient>
          </defs>

          {/* 1. Smartphone Outer Shell */}
          <rect
            className={styles.phoneBody}
            x="26"
            y="12"
            width="48"
            height="76"
            rx="9"
          />

          {/* 2. Screen Glass Area */}
          <rect
            className={styles.phoneScreen}
            x="30"
            y="18"
            width="40"
            height="62"
            rx="4"
          />

          {/* 3. Speaker & Home Button */}
          <line
            className={styles.phoneSpeaker}
            x1="44"
            y1="15"
            x2="56"
            y2="15"
          />
          <circle className={styles.phoneBtn} cx="50" cy="83.5" r="2.2" />

          {/* 4. Glowing Microchip / Service Gear Center */}
          <circle className={styles.gearCenter} cx="50" cy="46" r="12" />

          {/* 5. Diagnostic Circuit Traces */}
          <path
            className={styles.circuitLine}
            d="M50 34 V24 M40 40 L34 34 M60 40 L66 34"
          />
          <circle className={styles.circuitDot} cx="50" cy="24" r="1.5" />
          <circle className={styles.circuitDot} cx="34" cy="34" r="1.5" />
          <circle className={styles.circuitDot} cx="66" cy="34" r="1.5" />

          {/* 6. Precision Wrench Symbol */}
          <path
            className={styles.wrenchIcon}
            d="M47 43 L53 49 M49 41 C47 40 45 42 46 44 L44 48 L48 52 L52 50 C54 51 56 49 55 47 Z"
          />
        </svg>

        {/* Laser Scanner Beam */}
        <div className={styles.laserScan} />
      </div>

      {/* Brand Text Reveal */}
      <div className={styles.brandReveal}>
        <h1 className={styles.brandName}>PHONIX MOBILE</h1>
        <span className={styles.brandSub}>
          NO.1 MOBILE SERVICE • SINCE 2016
        </span>
        <div className={styles.productPill}>
          <span className={styles.pulsePoint} />
          <span>QUALITY IS OUR VALIDITY &bull; TIRUPUR</span>
        </div>
      </div>
    </div>
  );
}
