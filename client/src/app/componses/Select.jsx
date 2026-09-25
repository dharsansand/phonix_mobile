import React from "react";
import { Field, ErrorMessage } from "formik";
import styles from "./style/select.module.css";

const Select = ({
  text,
  name,
  options = [],
  placeholder = "Select an option",
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`${styles.selectWrapper} ${className}`}>
      {text && (
        <label htmlFor={name} className={styles.label}>
          {text}
          {required && <span className={styles.requiredStar}>*</span>}
        </label>
      )}

      <Field
        as="select"
        id={name}
        name={name}
        className={styles.selectField}
        {...props}
      >
     
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option, index) => (
          <option
            key={option.value || index}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </Field>

      <ErrorMessage name={name}>
        {(msg) => <div className={styles.errorMessage}>{msg}</div>}
      </ErrorMessage>
    </div>
  );
};

export default Select;