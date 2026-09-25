"use client";

import React, { useRef } from "react";
import { HiStar, HiCheckCircle } from "react-icons/hi";
import { FaGoogle } from "react-icons/fa";
import styles from "./style/TestimonialsSection.module.css";

// 🟢 Verified Customer Repair Reviews
const REVIEWS = [
  {
    id: 1,
    name: "Karthik R.",
    location: "Avinashi Road, Tirupur",
    device: "iPhone 13 Pro",
    service: "Original OLED Display Combo",
    rating: 5,
    comment:
      "My screen went completely white after an accidental drop. An authorized center quoted a huge amount and 5 days delay. Phonix Mobile replaced the original panel in just 35 minutes! True Tone and 120Hz ProMotion work flawlessly.",
    timeAgo: "2 days ago",
  },
  {
    id: 2,
    name: "Priya Soundarajan",
    location: "Periyar Colony, Tirupur",
    device: "Samsung Galaxy S22",
    service: "Motherboard Water Damage Fix",
    rating: 5,
    comment:
      "Phone fell into water and went completely dead. Other local shops said the motherboard was unfixable. The master technician at Phonix cleaned and micro-soldered the IC under a microscope. 100% data saved with zero photo loss!",
    timeAgo: "1 week ago",
  },
  {
    id: 3,
    name: "Vignesh Kumar",
    location: "Velampalayam, Tirupur",
    device: "OnePlus 11",
    service: "OEM Battery & 65W GaN Charger",
    rating: 5,
    comment:
      "Replaced my swollen battery with an original cell and bought their GaN fast charger. Warp charging works at full speed with zero heating, and they gave a written 90-day replacement warranty. Best repair center in Tirupur!",
    timeAgo: "3 weeks ago",
  },
];

// 3D Tilt Spotlight Review Card
function TestimonialCard({ review }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - top}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={styles.reviewCard}
    >
      <div className={styles.spotlight} />
      <div className={styles.topHighlightLine} />

      {/* Card Header: Device Pill & Verified Stamp */}
      <div className={styles.cardTop}>
        <div className={styles.devicePill}>
          <span className={styles.phoneIcon}>📱</span>
          <span>{review.device}</span>
        </div>
        <div className={styles.verifiedBadge}>
          <HiCheckCircle className={styles.checkIcon} />
          <span>Verified Repair</span>
        </div>
      </div>

      {/* Star Rating & Time */}
      <div className={styles.ratingRow}>
        <div className={styles.stars}>
          {Array.from({ length: review.rating }).map((_, i) => (
            <HiStar key={i} className={styles.starIcon} />
          ))}
        </div>
        <span className={styles.timeAgo}>{review.timeAgo}</span>
      </div>

      {/* Review Comment */}
      <p className={styles.commentText}>&ldquo;{review.comment}&rdquo;</p>

      {/* Service Repaired Tag */}
      <div className={styles.serviceTag}>
        <span className={styles.serviceLabel}>Service Done:</span>
        <strong className={styles.serviceName}>{review.service}</strong>
      </div>

      {/* Reviewer Meta */}
      <div className={styles.reviewerInfo}>
        <div className={styles.avatarCircle}>{review.name.charAt(0)}</div>
        <div className={styles.nameBlock}>
          <h4 className={styles.reviewerName}>{review.name}</h4>
          <span className={styles.reviewerLocation}>📍 {review.location}</span>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.container}>
        {/* HEADER AREA */}
        <div className={styles.headerBlock}>
          <div className={styles.tagBadge}>
            <span className={styles.pulseDot} />
            <span>REAL STORIES &bull; ZERO COMPROMISE</span>
          </div>

          <h2 className={styles.mainTitle}>
            Trusted by 50,000+ Device <br />
            Owners Across Tirupur.
          </h2>
          <p className={styles.subtitle}>
            Read honest feedback from customers who got their smartphones
            revived at our Periyar Colony workshop.
          </p>

          {/* Google Verified Review Pill */}
          <div className={styles.metricsPill}>
            <div className={styles.googleBrand}>
              <FaGoogle className={styles.googleIcon} />
              <span>Google Reviews</span>
            </div>
            <span className={styles.divider}>&bull;</span>
            <div className={styles.starScore}>
              <HiStar className={styles.goldStar} />
              <strong>4.9 / 5.0 Rating</strong>
            </div>
            <span className={styles.divider}>&bull;</span>
            <span className={styles.reviewCount}>
              1,200+ Reviews in Tirupur
            </span>
          </div>
        </div>

        {/* 3-COLUMN REVIEWS GRID */}
        <div className={styles.reviewsGrid}>
          {REVIEWS.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
