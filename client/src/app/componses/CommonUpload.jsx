import React, { useState, useEffect, useRef } from "react";
import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ErrorMessage, getIn } from "formik";

// Toast & Styles
import { ToastError } from "../componses/toast";
import styles from "./style/upload.module.css";
import { useUploadFileMutation } from "./../store/api/uploadApi";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CommonUpload = ({
  formik,
  name,
  limit = 1,
  setFileUploaded,
  existingImages,
  pdfimagepathname,
  settingname,
  labelName,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const isInternalChange = useRef(false);
  const [uploadFile] = useUploadFileMutation();

  const extractUrl = (res) => {
    if (!res) return "";
    if (typeof res === "string") return res;
    return (
      res?.url ||
      res?.file?.filename ||
      res?.file?.url ||
      res?.data?.url ||
      res?.data?.filename ||
      ""
    );
  };

  // 1. Sync fileList ONLY when existingImages prop changes externally (e.g. on Edit modal open)
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const currentVal =
      existingImages !== undefined ? existingImages : getIn(formik?.values, name);

    if (!currentVal || (Array.isArray(currentVal) && currentVal.length === 0)) {
      setFileList([]);
      return;
    }

    let files = [];
    if (Array.isArray(currentVal)) {
      files = currentVal.map((img, index) => {
        const url = typeof img === "string" ? img : img?.url;
        return {
          uid: `-${index}`,
          name: `image-${index}`,
          status: "done",
          url: url,
        };
      });
    } else if (typeof currentVal === "string" && currentVal.trim() !== "") {
      files = [
        {
          uid: "-1",
          name: "image",
          status: "done",
          url: currentVal,
        },
      ];
    }
    setFileList(files);
  }, [existingImages]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || "Image Preview");
    setPreviewVisible(true);
  };

  // 2. Custom Upload Request
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFile({
        endpoint: `/${settingname}/${pdfimagepathname}`,
        formData,
      }).unwrap();

      const uploadedUrl = extractUrl(response);
      file.url = uploadedUrl;
      file.response = response;

      onSuccess(response, file);
    } catch (err) {
      console.error("Upload error:", err);
      onError(err);
      ToastError("Upload failed. Please try again.");
    }
  };

  // 3. SAFE onChange (Prevents "Cannot update Formik while rendering" error)
  const handleChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);

    // Only update Formik when file action is completed or removed
    if (file.status === "done" || file.status === "removed") {
      isInternalChange.current = true;

      const completedUrls = newFileList
        .map((f) => f.url || extractUrl(f.response))
        .filter((url) => typeof url === "string" && url.trim() !== "");

      const finalValue = limit === 1 ? completedUrls[0] || "" : completedUrls;

      // Defer execution out of the current render microtask
      setTimeout(() => {
        formik.setFieldValue(name, finalValue);
        if (setFileUploaded) {
          setFileUploaded(completedUrls.length > 0);
        }
      }, 0);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/avif",
      ];

      if (!allowedTypes.includes(file.type)) {
        ToastError("Images only! Allowed types: JPG, PNG, WEBP, AVIF");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
  };

  const uploadButton = (
    <div className={styles.uploadBtnContent}>
      <PlusOutlined className={styles.uploadIcon} />
      <span className={styles.uploadText}>Upload</span>
    </div>
  );

  const isError = getIn(formik?.touched, name) && getIn(formik?.errors, name);

  return (
    <div className={styles.uploadWrapper}>
      {labelName && <label className={styles.label}>{labelName}</label>}

      <div className={isError ? styles.hasError : ""}>
        <Upload
          {...uploadProps}
          listType="picture-card"
          fileList={fileList}
          customRequest={customRequest}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= limit ? null : uploadButton}
        </Upload>
      </div>

      <ErrorMessage name={name}>
        {(msg) => <div className={styles.errorMessage}>{msg}</div>}
      </ErrorMessage>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        centered
        onCancel={handleCancel}
      >
        <img alt="Preview" className={styles.previewImage} src={previewImage} />
      </Modal>
    </div>
  );
};

export default CommonUpload;