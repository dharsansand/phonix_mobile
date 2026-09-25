import React, { useState, useRef, useEffect } from "react";
import { useField } from "formik";
import styles from "./style/searchSelect.module.css";

const SearchSelect = ({
  text,
  name,
  options = [],
  placeholder = "Select or search...",
  required = false,
  className = "",
}) => {
  const [field, meta, helpers] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Find the selected option's label
  const selectedOption = options.find((opt) => opt.value === field.value);

  // Filter options based on user search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    helpers.setValue(val);
    helpers.setTouched(true);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`${styles.wrapper} ${className}`} ref={dropdownRef}>
      {text && (
        <label className={styles.label}>
          {text}
          {required && <span className={styles.requiredStar}>*</span>}
        </label>
      )}

      {/* Selected Box / Trigger */}
      <div
        className={`${styles.selectBox} ${meta.touched && meta.error ? styles.inputError : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? styles.selectedValue : styles.placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown with Search */}
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <ul className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  className={`${styles.optionItem} ${
                    opt.value === field.value ? styles.selectedItem : ""
                  }`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className={styles.noData}>No results found</li>
            )}
          </ul>
        </div>
      )}

      {/* Formik Error Message */}
      {meta.touched && meta.error && (
        <div className={styles.errorMessage}>{meta.error}</div>
      )}
    </div>
  );
};

export default SearchSelect;