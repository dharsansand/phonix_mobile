import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useField } from "formik";
import styles from "./style/jodit.module.css";

const RichTextEditor = ({
  text,
  name,
  placeholder = "Start typing here...",
  required = false,
  className = "",
  config = {},
}) => {
  const editor = useRef(null);
  const [field, meta, helpers] = useField(name);

  // Memoize config so it doesn't cause unnecessary re-renders
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder,
      height: 300,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "table",
        "link",
        "|",
        "align",
        "undo",
        "redo",
      ],
      ...config,
    }),
    [placeholder, config]
  );

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {/* Label */}
      {text && (
        <label className={styles.label}>
          {text}
          {required && <span className={styles.requiredStar}>*</span>}
        </label>
      )}

      {/* Editor Box */}
      <div
        className={`${styles.editorContainer} ${
          meta.touched && meta.error ? styles.inputError : ""
        }`}
      >
        <JoditEditor
          ref={editor}
          value={field.value || ""}
          config={editorConfig}
          onBlur={(newContent) => {
            helpers.setValue(newContent);
            helpers.setTouched(true);
          }}
          onChange={() => {}}
        />
      </div>

      {/* Formik Error Message */}
      {meta.touched && meta.error && (
        <div className={styles.errorMessage}>{meta.error}</div>
      )}
    </div>
  );
};

export default RichTextEditor;