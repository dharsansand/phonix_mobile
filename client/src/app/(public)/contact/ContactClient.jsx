"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HiHome,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiArrowRight,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./contact.module.css";

const SERVICES_OPTIONS = [
  "Screen / Display Replacement",
  "Cracked Outer Glass Separation",
  "Battery Draining / Replacement",
  "Motherboard Dead / Chip-Level IC",
  "Water / Liquid Damage Recovery",
  "Charging Port / Microphone / Speaker",
  "Accessories & Fast Chargers",
  "Other Device Inquiry",
];

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    deviceModel: "",
    serviceType: SERVICES_OPTIONS[0],
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generates pre-filled WhatsApp message
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const text =
      `*New Repair Estimate Request - Phonix Mobile*\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `📱 *Device Model:* ${formData.deviceModel}\n` +
      `🛠️ *Required Service:* ${formData.serviceType}\n` +
      `📝 *Details:* ${formData.message || "None"}`;

    const whatsappUrl = `https://wa.me/917502634924?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className={styles.contactPageWrapper}>
      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <div className={styles.topNav}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.crumbLink}>
              <HiHome size={14} />
              <span>Home</span>
            </Link>
            <span className={styles.crumbSep}>/</span>
            <span className={styles.activeCrumb}>Contact Us</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className={styles.headerBlock}>
          <span className={styles.eyebrow}>WE ARE HERE TO HELP</span>
          <h1 className={styles.mainTitle}>
            Get In Touch With Our Technicians
          </h1>
          <p className={styles.subTitle}>
            Need an on-the-spot screen replacement or complex chip-level
            diagnostics? Visit our Periyar Colony workshop or submit your device
            details below.
          </p>
        </div>

        {/* Split Grid: Left Details & Right Form */}
        <div className={styles.contactGrid}>
          {/* ================= LEFT COLUMN: CONTACT CHANNELS ================= */}
          <div className={styles.leftCol}>
            {/* Quick WhatsApp Action Card */}
            <div className={styles.whatsappCard}>
              <div className={styles.waHeader}>
                <div className={styles.waIconBox}>
                  <FaWhatsapp size={24} />
                </div>
                <div>
                  <span className={styles.waBadge}>FASTEST RESPONSE</span>
                  <h3 className={styles.waTitle}>Chat on WhatsApp</h3>
                </div>
              </div>
              <p className={styles.waText}>
                Send photos or video of your damaged device for an immediate
                price estimate and spare parts availability.
              </p>
              <a
                href="https://wa.me/917502634924?text=Hi%20Phonix%20Mobile,%20I%20need%20a%20repair%20quote"
                target="_blank"
                rel="noreferrer"
                className={styles.waBtn}
              >
                <span>Launch WhatsApp Chat</span>
                <HiArrowRight size={14} />
              </a>
            </div>

            {/* Direct Contact Cards */}
            <div className={styles.channelsList}>
              {/* Phone */}
              <div className={styles.channelItem}>
                <div className={styles.channelIcon}>
                  <HiOutlinePhone size={22} />
                </div>
                <div>
                  <span className={styles.channelLabel}>
                    Direct Phone Support
                  </span>
                  <a href="tel:+917502634924" className={styles.channelValue}>
                    +91 7502634924
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className={styles.channelItem}>
                <div className={styles.channelIcon}>
                  <HiOutlineLocationMarker size={22} />
                </div>
                <div>
                  <span className={styles.channelLabel}>Workshop Location</span>
                  <p className={styles.channelValueText}>
                    Periyar Colony, Tirupur, Tamil Nadu - 641652
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className={styles.channelItem}>
                <div className={styles.channelIcon}>
                  <HiOutlineClock size={22} />
                </div>
                <div>
                  <span className={styles.channelLabel}>Operating Hours</span>
                  <p className={styles.channelValueText}>
                    Mon - Sun: 09:30 AM - 09:30 PM (7 Days Open)
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className={styles.channelItem}>
                <div className={styles.channelIcon}>
                  <HiOutlineMail size={22} />
                </div>
                <div>
                  <span className={styles.channelLabel}>Customer Support</span>
                  <a
                    href="mailto:support@phonixmobile.com"
                    className={styles.channelValue}
                  >
                    support@phonixmobile.com
                  </a>
                </div>
              </div>
            </div>

            {/* Quality Promise Pill */}
            <div className={styles.promisePill}>
              <HiOutlineShieldCheck size={20} className={styles.shieldIcon} />
              <span>
                Free Diagnostics &bull; 90-Day Spares Warranty &bull; Zero Data
                Loss
              </span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INSTANT ESTIMATE FORM ================= */}
          <div className={styles.rightCol}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <span className={styles.formTag}>FREE DIAGNOSTIC INQUIRY</span>
                <h2 className={styles.formTitle}>Request a Repair Quote</h2>
                <p className={styles.formSub}>
                  Fill in your device details to connect directly with our
                  workshop technician.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className={styles.form}>
                {/* Name */}
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Karthik Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>

                {/* Phone & Model Row */}
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone">Phone / WhatsApp Number *</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="deviceModel">Device Model *</label>
                    <input
                      id="deviceModel"
                      type="text"
                      name="deviceModel"
                      required
                      placeholder="e.g. iPhone 13, OnePlus 11"
                      value={formData.deviceModel}
                      onChange={handleChange}
                      className={styles.inputField}
                    />
                  </div>
                </div>

                {/* Service Type Dropdown */}
                <div className={styles.inputGroup}>
                  <label htmlFor="serviceType">Service Required *</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    {SERVICES_OPTIONS.map((srv, i) => (
                      <option key={i} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Details / Symptoms */}
                <div className={styles.inputGroup}>
                  <label htmlFor="message">Describe the Issue (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="e.g. Screen glass is shattered, touch is working but display has small lines..."
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textareaField}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  <FaWhatsapp size={19} />
                  <span>Send Request to WhatsApp</span>
                  <HiArrowRight size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
