"use client";

import React, { useState } from "react";
import {
  HiPlus,
  HiMinus,
  HiOutlinePhone,
  HiArrowRight,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineChip,
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./style/FaqSection.module.css";

// 🟢 OPTIMIZED FAQ ITEMS: Designed to match "People Also Ask" on Google
const FAQ_ITEMS = [
  {
    id: "01",
    // SEO FIX: Added "Mobile Display Replacement in Tiruppur"
    question: "Do you provide original mobile display replacement in Tiruppur?",
    answer:
      "Yes. As the leading mobile repair center in Tiruppur, we use certified OEM original display panels. For iPhones and high-end devices, we run optical EEPROM programmer calibration to preserve True Tone, Face ID, and 120Hz ProMotion touch fidelity.",
    tags: ["Original OEM Panel", "True Tone Preserved", "30-Min Swap"],
    actionText: "Book Display Fix",
  },
  {
    id: "02",
    // SEO FIX: Added "Mobile Repair in Tiruppur"
    question: "Is my data safe during mobile repair in Tiruppur?",
    answer:
      "Absolutely. For 99% of hardware repairs like screen replacement, battery changes, or charging port fixes, your personal data remains completely untouched. We follow a strict zero-data-loss privacy protocol at our Phonix Mobile workshop.",
    tags: ["100% Data Safe", "No Factory Reset Needed", "Strict Privacy"],
    actionText: "Check Data Safety",
  },
  {
    id: "03",
    // SEO FIX: Added "Smartphone Service"
    question: "Can you fix dead or water-damaged smartphones?",
    answer:
      "Yes! Our advanced smartphone service in Tiruppur uses 4K stereo microscopes and BGA reballing stations. Our technicians can trace burnt power ICs and revive dead motherboards that other shops have rejected.",
    tags: ["BGA Reballing", "Water Damage Recovery", "No Fix No Fee"],
    actionText: "Get Board Diagnosis",
  },
  {
    id: "04",
    // SEO FIX: Added "Mobile Service in Tiruppur"
    question: "How fast is your mobile service and what is the warranty?",
    answer:
      "Most mobile screen and battery swaps take only 30 to 45 minutes at our Tirupur workshop. All replaced spare parts come with a written 90-day replacement warranty with instant support.",
    tags: [
      "30-Min Fast Turnaround",
      "90-Day Written Warranty",
      "Instant Replacement",
    ],
    actionText: "Claim Warranty Info",
  },
  {
    id: "05",
    // SEO FIX: Added "Mobile Glass Repair"
    question: "Do you offer mobile glass-only repair in Tiruppur?",
    answer:
      "Yes! Through precision laser separation, we replace only the broken outer glass while preserving your original factory display. This is the most cost-effective mobile glass repair in Tiruppur, saving you up to 60% costs.",
    tags: ["Laser Glass Separation", "Save Up To 60%", "Original OLED Intact"],
    actionText: "Inquire Glass Fix",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleCard = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        {/* ================= LEFT COLUMN: STICKY COMMAND HUB ================= */}
        <div className={styles.leftHub}>
          <div className={styles.stickyContent}>
            <div className={styles.hubBadge}>
              <span className={styles.pulseGreen} />
              <span>TECHNICIAN SUPPORT HUB</span>
            </div>

            {/* SEO FIX: Changed from "Clear Answers" to Keyword-rich H2 */}
            <h2 className={styles.hubTitle}>
              Mobile Repair <br />
              <span style={{ color: "#00d2ff" }}>Tiruppur FAQ.</span>
            </h2>

            {/* SEO FIX: Added "Smartphone Service" and "Periyar Colony" to Subheading */}
            <p className={styles.hubSub}>
              Everything you need to know about our smartphone service, OEM
              component sourcing, and warranty guarantees in Periyar Colony,
              Tirupur.
            </p>

            {/* Live Workshop Support Card */}
            <div className={styles.liveCard}>
              <div className={styles.liveHeader}>
                <div className={styles.techAvatar}>⚡</div>
                <div>
                  <h4 className={styles.techName}>Phonix Diagnostic Lab</h4>
                  <span className={styles.techStatus}>
                    Online &bull; Instant WhatsApp Replies
                  </span>
                </div>
              </div>

              <p className={styles.liveText}>
                Need a custom price quote for mobile repair in Tiruppur? Talk
                directly with our master technicians.
              </p>

              <div className={styles.liveButtons}>
                <a
                  href="https://wa.me/917502634924?text=Hi%20Phonix%20Mobile,%20I%20have%20a%20question%20about%20phone%20repair"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.whatsappBtn}
                >
                  <FaWhatsapp size={18} />
                  <span>Chat with Technician</span>
                </a>

                <a href="tel:+917502634924" className={styles.callBtn}>
                  <HiOutlinePhone size={17} />
                  <span>+91 7502634924</span>
                </a>
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <HiOutlineShieldCheck className={styles.trustIcon} />
                <span>Exclusive Gift</span>
              </div>
              <div className={styles.trustItem}>
                <HiOutlineClock className={styles.trustIcon} />
                <span>30-Min Express</span>
              </div>
              <div className={styles.trustItem}>
                <HiOutlineChip className={styles.trustIcon} />
                <span>OEM Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE ACCORDION DECK ================= */}
        <div className={styles.rightDeck}>
          <div className={styles.deckList}>
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.id}
                  className={`${styles.consoleCard} ${isOpen ? styles.cardOpen : ""}`}
                  onClick={() => toggleCard(idx)}
                >
                  {isOpen && <div className={styles.beamLine} />}

                  <div className={styles.cardHeader}>
                    <span className={styles.numberBadge}>{item.id}</span>
                    <h3 className={styles.questionText}>{item.question}</h3>
                    <div className={styles.toggleBtn}>
                      {isOpen ? <HiMinus size={18} /> : <HiPlus size={18} />}
                    </div>
                  </div>

                  <div
                    className={`${styles.bodyWrapper} ${isOpen ? styles.bodyOpen : ""}`}
                  >
                    <p className={styles.answerText}>{item.answer}</p>

                    <div className={styles.tagsContainer}>
                      {item.tags.map((tag, i) => (
                        <span key={i} className={styles.tagPill}>
                          ✓ {tag}
                        </span>
                      ))}
                    </div>

                    <div className={styles.cardAction}>
                      <a
                        href={`https://wa.me/917502634924?text=${encodeURIComponent(
                          `Hi Phonix Mobile, I saw question #${item.id} (${item.question}) and want to book: ${item.actionText}`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.bookPillBtn}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{item.actionText}</span>
                        <HiArrowRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
