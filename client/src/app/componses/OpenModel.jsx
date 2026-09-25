"use client";

import { Modal } from "antd";
import styles from "./style/openModal.module.css";

const OpenModel = ({
  open,
  setOpen,
  children,
  formik,
  handleCancel,
  width = 750,
}) => {
  const handleClose = () => {
    if (handleCancel) {
      handleCancel(formik, setOpen);
    } else {
      setOpen(false);
    }
  };

  return (
    <Modal
      footer={null}
      open={open}
      centered
      onCancel={handleClose}
      width={width}
      destroyOnHidden
      className={styles.customModal}
    >
      {children}
    </Modal>
  );
};

export default OpenModel;