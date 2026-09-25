"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { Button, Popconfirm } from "antd";

// Components
import PageHeader from "../../../componses/PageHeader";
import OpenModel from "../../../componses/OpenModel";
import Text from "../../../componses/Text";
import DataTable from "../../../componses/DataTable";
import CommonUpload from "../../../componses/CommonUpload";
import Checkinputbox from "../../../componses/Checkinputbox";
import styles from "../../../componses/style/openModal.module.css";

import {
  useGetHomeBannersQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useToggleBannerStatusMutation,
} from "../../../store/api/bannerApi";
import { ToastSuccess } from "../../../componses/toast";
import Select from "@/app/componses/Select";
import { themeOptions } from "@/app/componses/enumConfig";
// import BrannervalidationSchema from "./brannervalidation";

export default function Banner() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // RTK Query Hooks
  const { data: banner = [], isLoading } = useGetHomeBannersQuery();
  const data = Array.isArray(banner) ? banner : [];

  const [addBanner] = useAddBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [toggleBannerStatus] = useToggleBannerStatusMutation();

  const handleEdit = (record) => {
    setEditData(record);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id).unwrap();
      ToastSuccess("Banner deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const toggleActive = async (record) => {
    try {
      await toggleBannerStatus({
        id: record._id,
        Active: !record.Active,
      }).unwrap();
      ToastSuccess("Status updated successfully");
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleCancel = (formik) => {
    formik.resetForm();
    setEditData(null);
    setOpen(false);
  };

  const handleSubmit = async (values, actions) => {
    try {
      console.log("values", values);
      const payload = {
        title: values.title,
        subTitle: values.subTitle,
        highlight: values.highlight,
        content: values.content,
        banner: values.banner,
        Active: values.Active,
        theme: values.theme,
        badge: values.badge,
      };

      if (editData) {
        await updateBanner({ id: editData._id, ...payload }).unwrap();
        ToastSuccess("Banner updated successfully");
      } else {
        await addBanner(payload).unwrap();
        ToastSuccess("Banner added successfully");
      }

      setOpen(false);
      setEditData(null);
      actions.resetForm();
    } catch (error) {
      console.error("Form Submit Error:", error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Table Columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "SubTitle",
      dataIndex: "subTitle",
      key: "subTitle",
    },
    {
      title: "Highlight",
      dataIndex: "highlight",
      key: "highlight",
      render: (text) => text || "-",
    },
    // {
    //   title: "Active",
    //   dataIndex: "Active",
    //   key: "Active",
    //   render: (_, record) => (
    //     <input
    //       type="checkbox"
    //       checked={record.Active}
    //       onChange={() => toggleActive(record)}
    //       style={{ cursor: "pointer", accentColor: "var(--tan)" }}
    //     />
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            style={{ color: "var(--tan)", padding: 0 }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this banner?"
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
        title="Home Banners"
        subtitle="Manage hero banners, active displays, and highlights."
        buttonText="Add Banner"
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
          subTitle: editData?.subTitle || "",
          highlight: editData?.highlight || "",
          content: editData?.content || "",
          banner: editData?.banner || "",
          theme: editData?.theme || "",
          badge: editData?.badge || "",
          Active: editData?.Active ?? true,
        }}
        // validationSchema={BrannervalidationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <OpenModel
            open={open}
            setOpen={setOpen}
            formik={formik}
            handleCancel={handleCancel}
            width={850}
          >
            <div>
              <div className={styles.modalHeader}>
                <h2 className={styles.mainTitle}>
                  {editData ? "Edit Banner" : "Add Banner"}
                </h2>
              </div>

              <div className={styles.sectionTitle}>Banner Details</div>

              <Form>
                <div className={styles.formGrid}>
                  <Text
                    text="Title"
                    name="title"
                    placeholder="Enter title"
                    required={true}
                  />
                  <Text
                    text="SubTitle"
                    name="subTitle"
                    placeholder="Enter subTitle"
                    required={true}
                  />
                  <Select
                    text="Theme"
                    name="theme"
                    required={true}
                    placeholder="Choose a Theme"
                    options={themeOptions}
                  />
                  <Text
                    text="Badge"
                    name="badge"
                    placeholder="Enter badge"
                    required={true}
                  />
                </div>

                <div className={styles.formGrid}>
                  <Text
                    text="Highlight"
                    name="highlight"
                    placeholder="Enter highlight"
                  />
                  <Text
                    text="Content"
                    name="content"
                    placeholder="Enter content"
                    required={true}
                  />
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <CommonUpload
                    formik={formik}
                    name="banner"
                    limit={1}
                    existingImages={editData?.banner}
                    pdfimagepathname="banner"
                    settingname="banner"
                    labelName="Banner Image"
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <Checkinputbox name="Active" label="Active Status" />
                </div>

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
                    {editData ? "Update" : "Save"}
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
