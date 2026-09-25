import React from "react";
import { Field } from "formik";
import styles from "./style/checkbox.module.css";

const Checkinputbox = ({ name, label, className = "" }) => (
  <div className={`${styles.checkboxWrapper} ${className}`}>
    <label className={styles.checkboxLabel} htmlFor={name}>
      {/* Hidden Formik Checkbox */}
      <Field
        type="checkbox"
        name={name}
        id={name}
        className={styles.hiddenInput}
      />

      {/* Styled Custom Box */}
      <span className={styles.customBox}>
        <svg
          className={styles.checkIcon}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>

      {/* Label Text */}
      <span className={styles.labelText}>{label}</span>
    </label>
  </div>
);

export default Checkinputbox;