"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { Button, Popconfirm, Tag } from "antd";

// Components
import PageHeader from "../../../componses/PageHeader";
import OpenModel from "../../../componses/OpenModel";
import Text from "../../../componses/Text";
import DataTable from "../../../componses/DataTable";
import CommonUpload from "../../../componses/CommonUpload";
import RichTextEditor from "../../../componses/RichTextEditor";
import styles from "../../../componses/style/openModal.module.css";

import {
  useGetServiceQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from "../../../store/api/serviceApi.js";
import { ToastError, ToastSuccess } from "../../../componses/toast";

export default function ServicesManager() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // RTK Query Hooks
  const { data: servicesResponse = [], isLoading } = useGetServiceQuery();
  const data = Array.isArray(servicesResponse)
    ? servicesResponse
    : servicesResponse?.data || [];

  const [addService] = useAddServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const handleEdit = (record) => {
    setEditData(record);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id).unwrap();
      ToastSuccess("Service repair case deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      ToastError(error?.data?.message || "Delete failed");
    }
  };

  const handleCancel = (formik) => {
    formik.resetForm();
    setEditData(null);
    setOpen(false);
  };

  const handleSubmit = async (values, actions) => {
    try {
      // Helper to extract uploaded image URL
      const extractImageUrl = (img) => {
        if (!img) return "";
        if (typeof img === "string") return img;
        if (Array.isArray(img) && img.length > 0) {
          return typeof img[0] === "string" ? img[0] : img[0]?.url || "";
        }
        return img?.url || "";
      };

      const payload = {
        title: values.title.trim(),
        slug:
          values.slug?.trim() ||
          values.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        device: values.device.trim(),
        turnaround: values.turnaround.trim(),
        warranty: values.warranty.trim(),
        badge: values.badge.trim(),
        beforeImg: extractImageUrl(values.beforeImg),
        afterImg: extractImageUrl(values.afterImg),
        desc: values.desc,

        // 🟢 SEO & Meta Fields Added
        meta_title: values.meta_title?.trim() || "",
        meta_description: values.meta_description?.trim() || "",
        meta_keywords: values.meta_keywords?.trim() || "",
      };

      console.log("➡️ Submitting Service Payload:", payload);

      if (editData) {
        await updateService({ id: editData._id, ...payload }).unwrap();
        ToastSuccess("Service repair case updated successfully");
      } else {
        await addService(payload).unwrap();
        ToastSuccess("Service repair case created successfully");
      }

      setOpen(false);
      setEditData(null);
      actions.resetForm();
    } catch (error) {
      console.error("Error submitting service:", error);
      ToastError(error?.data?.message || "Failed to save service case");
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Helper to ensure images array for CommonUpload
  const formatImagesForUpload = (img) => {
    if (!img) return [];
    if (Array.isArray(img)) return img;
    return [img];
  };

  // Table Columns
  const columns = [
    {
      title: "Title & Device",
      key: "title",
      render: (_, record) => (
        <div>
          <strong style={{ color: "#ffffff", fontSize: "0.95rem" }}>
            {record.title}
          </strong>
          <div
            style={{ color: "var(--tan)", fontSize: "0.8rem", marginTop: 2 }}
          >
            📱 {record.device}
          </div>
          {record.meta_title && (
            <div
              style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: 3 }}
            >
              🔍 {record.meta_title}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Before Image",
      dataIndex: "beforeImg",
      key: "beforeImg",
      render: (img) => (
        <img
          src={Array.isArray(img) ? img[0] : img}
          alt="Before"
          style={{
            width: "55px",
            height: "55px",
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid rgba(239,68,68,0.5)",
          }}
        />
      ),
    },
    {
      title: "After Image",
      dataIndex: "afterImg",
      key: "afterImg",
      render: (img) => (
        <img
          src={Array.isArray(img) ? img[0] : img}
          alt="After"
          style={{
            width: "55px",
            height: "55px",
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid rgba(34,197,94,0.5)",
          }}
        />
      ),
    },
    {
      title: "Turnaround & Warranty",
      key: "meta",
      render: (_, record) => (
        <div style={{ fontSize: "0.85rem" }}>
          <div>⏱️ {record.turnaround}</div>
          <div style={{ color: "#22c55e", marginTop: 2 }}>
            🛡️ {record.warranty}
          </div>
        </div>
      ),
    },
    {
      title: "Badge",
      dataIndex: "badge",
      key: "badge",
      render: (badge) =>
        badge ? (
          <Tag color="cyan" style={{ fontWeight: 700 }}>
            {badge}
          </Tag>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            style={{ color: "var(--tan)", padding: 0, fontWeight: 700 }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this repair case?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger style={{ padding: 0 }}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <PageHeader
        title="Repair Services & Case Studies"
        subtitle="Manage Before & After restorations, SEO metadata, lab procedures, and warranties."
        buttonText="Add Service Case"
        onClick={() => {
          setEditData(null);
          setOpen(true);
        }}
      />

      <DataTable data={data} columns={columns} loading={isLoading} />

      <Formik
        enableReinitialize
        initialValues={{
          title: editData?.title || "",
          slug: editData?.slug || "",
          device: editData?.device || "",
          turnaround: editData?.turnaround || "30 Mins",
          warranty: editData?.warranty || "90 Days Warranty",
          badge: editData?.badge || "MOST POPULAR",
          beforeImg: formatImagesForUpload(editData?.beforeImg),
          afterImg: formatImagesForUpload(editData?.afterImg),
          desc: editData?.desc || "",

          // 🟢 SEO Initial Values
          meta_title: editData?.meta_title || "",
          meta_description: editData?.meta_description || "",
          meta_keywords: editData?.meta_keywords || "",
        }}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <OpenModel
            open={open}
            setOpen={setOpen}
            formik={formik}
            handleCancel={handleCancel}
            width={900}
          >
            <div>
              <div className={styles.modalHeader}>
                <h2 className={styles.mainTitle}>
                  {editData ? "Edit Service Case" : "Add Service Case"}
                </h2>
              </div>

              <Form>
                {/* ================= 1. REPAIR INFORMATION ================= */}
                <div className={styles.sectionTitle}>Repair Information</div>

                {/* Row 1: Title & Slug */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.25rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Text
                    text="Service Title"
                    name="title"
                    placeholder="e.g. Laser Screen & Glass Replacement"
                    required={true}
                  />

                  <Text
                    text="URL Slug"
                    name="slug"
                    placeholder="e.g. screen-glass-replacement"
                    required={true}
                  />
                </div>

                {/* Row 2: Device Model & Promo Badge */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.25rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Text
                    text="Device Model"
                    name="device"
                    placeholder="e.g. iPhone 14 Pro Max"
                    required={true}
                  />

                  <Text
                    text="Badge Tag"
                    name="badge"
                    placeholder="e.g. MOST POPULAR / LAB GRADE"
                  />
                </div>

                {/* Row 3: Turnaround Time & Warranty */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.25rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <Text
                    text="Turnaround Time"
                    name="turnaround"
                    placeholder="e.g. 30 Mins / 2-4 Hours"
                    required={true}
                  />

                  <Text
                    text="Warranty Period"
                    name="warranty"
                    placeholder="e.g. 90 Days Warranty"
                    required={true}
                  />
                </div>

                {/* ================= 2. BEFORE & AFTER IMAGES ================= */}
                <div className={styles.sectionTitle}>
                  Before & After Comparison Images
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {/* Before Image Upload */}
                  <div
                    style={{
                      background: "rgba(9, 13, 22, 0.6)",
                      border: "1px dashed rgba(239, 68, 68, 0.4)",
                      padding: "1rem",
                      borderRadius: "14px",
                    }}
                  >
                    <CommonUpload
                      formik={formik}
                      name="beforeImg"
                      limit={1}
                      existingImages={formik.values.beforeImg}
                      pdfimagepathname="service"
                      settingname="service"
                      labelName="Damaged / Before Image *"
                    />
                  </div>

                  {/* After Image Upload */}
                  <div
                    style={{
                      background: "rgba(9, 13, 22, 0.6)",
                      border: "1px dashed rgba(34, 197, 94, 0.4)",
                      padding: "1rem",
                      borderRadius: "14px",
                    }}
                  >
                    <CommonUpload
                      formik={formik}
                      name="afterImg"
                      limit={1}
                      existingImages={formik.values.afterImg}
                      pdfimagepathname="service"
                      settingname="service"
                      labelName="Restored / After Image *"
                    />
                  </div>
                </div>

                {/* ================= 3. LAB PROCEDURE & DESCRIPTION ================= */}
                <div className={styles.sectionTitle}>
                  Lab Procedure & Description
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <RichTextEditor
                    name="desc"
                    value={formik.values.desc}
                    onChange={(content) =>
                      formik.setFieldValue("desc", content)
                    }
                    placeholder="Describe the diagnosis, equipment used (microscope, laser), and symptoms solved..."
                  />
                </div>

                {/* ================= 4. 🟢 SEO & META DETAILS SECTION ================= */}
                <div className={styles.sectionTitle}>
                  🔍 Search Engine Optimization (SEO)
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.1rem",
                    marginBottom: "2rem",
                  }}
                >
                  <Text
                    text="Meta Title"
                    name="meta_title"
                    placeholder="e.g. iPhone 14 Pro Max Screen Replacement in Tirupur | Phonix Mobile"
                  />

                  <Text
                    text="Meta Keywords"
                    name="meta_keywords"
                    placeholder="e.g. iphone screen replacement, tirupur mobile service, display fix"
                  />

                  <Text
                    text="Meta Description"
                    name="meta_description"
                    placeholder="e.g. Get original OLED display replacement for iPhone 14 Pro Max in 30 minutes with 90-day warranty in Tirupur."
                  />
                </div>

                {/* Footer Buttons */}
                <div className={styles.footerButtons}>
                  <Button
                    onClick={() => handleCancel(formik)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={formik.isSubmitting}
                    className={styles.saveBtn}
                  >
                    {editData ? "Update Service Case" : "Save Service Case"}
                  </Button>
                </div>
              </Form>
            </div>
          </OpenModel>
        )}
      </Formik>
    </div>
  );
}
