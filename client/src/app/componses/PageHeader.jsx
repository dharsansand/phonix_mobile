"use client";

import Link from "next/link";
// import { LuPlus } from "react-icons/lu";
import styles from "./style/pageHeader.module.css";

const PageHeader = ({
  title,
  subtitle,
  buttonText = "Add",
  onClick,
  btnLink,
  className = "",
  showButton = true,
}) => {
  const buttonContent = (
    <>
      <span>{buttonText}</span>
      {/* <LuPlus size={18} /> */}
    </>
  );

  return (
    <div className={`${styles.headerContainer} ${className}`}>
      {/* Title & Subtitle */}
      <div className={styles.textContainer}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {showButton &&
        (btnLink ? (
          <Link href={btnLink} className={styles.addButton}>
            {buttonContent}
          </Link>
        ) : (
          <button type="button" className={styles.addButton} onClick={onClick}>
            {buttonContent}
          </button>
        ))}
    </div>
  );
};

export default PageHeader;
