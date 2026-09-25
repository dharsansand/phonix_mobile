import React from "react";
import { Field, ErrorMessage } from "formik";
import styles from "./style/text.module.css";

const Text = ({
  text,
  name,
  placeholder,
  required = false,
  type = "text",
  className = "",
  ...props
}) => {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {text && (
        <label htmlFor={name} className={styles.label}>
          {text}
          {required && <span className={styles.requiredStar}>*</span>}
        </label>
      )}

      <Field
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        className={styles.inputField}
        {...props}
      />

      <ErrorMessage name={name}>
        {(msg) => <div className={styles.errorMessage}>{msg}</div>}
      </ErrorMessage>
    </div>
  );
};

export default Text;