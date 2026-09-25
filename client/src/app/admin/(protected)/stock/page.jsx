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
  useGetCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../../store/api/categoryApi";
import { ToastError, ToastSuccess } from "../../../componses/toast";
import { useGetStockQuery } from "@/app/store/api/stockApi";
// import BrannervalidationSchema from "./brannervalidation";

export default function Banner() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // RTK Query Hooks
  const { data: banner = [], isLoading } = useGetStockQuery();
  const data = Array.isArray(banner) ? banner : [];
  console.log("banner", data);

  const [addBanner] = useAddCategoryMutation();
  const [updateBanner] = useUpdateCategoryMutation();
  const [deleteBanner] = useDeleteCategoryMutation();

  const handleEdit = (record) => {
    setEditData(record);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id).unwrap();
      ToastSuccess("Category deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
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
        name: values.name,
      };

      if (editData) {
        await updateBanner({ id: editData._id, ...payload }).unwrap();
        ToastSuccess("Category updated successfully");
      } else {
        await addBanner(payload).unwrap();
        ToastSuccess("Category added successfully");
      }

      setOpen(false);
      setEditData(null);
      actions.resetForm();
    } catch (error) {
      console.log("error", error);
      ToastError(error?.data?.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Table Columns
  const columns = [
    {
      title: "Product",
      dataIndex: ["product", "name"],
      key: "productName",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "categoryName",
    },

    {
      title: "Colour",
      dataIndex: "colour",
      key: "colourName",
      render: (text) => text || "-",
    },
    {
      title: "Colour size",
      dataIndex: "size",
      key: "coloursize",
      render: (text) => text || "-",
    },
    {
      title: "Display size",
      dataIndex: "displaysize",
      key: "displaysizeName",
      render: (text) => text || "-",
    },
    {
      title: "capacity",
      dataIndex: "capacity",
      key: "capacityName",
      render: (text) => text || "-",
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "priceName",
      render: (text) => (text ? `₹ ${text}` : "-"),
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <div style={{ display: "flex", gap: "0.5rem" }}>
    //       <Button
    //         type="link"
    //         onClick={() => handleEdit(record)}
    //         style={{ color: "var(--tan)", padding: 0 }}
    //       >
    //         Edit
    //       </Button>

    //       <Popconfirm
    //         title="Are you sure you want to delete this banner?"
    //         onConfirm={() => handleDelete(record._id)}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <Button type="link" danger style={{ padding: 0 }}>
    //           Delete
    //         </Button>
    //       </Popconfirm>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <PageHeader
        title="Stock Management"
        subtitle="Manage hero banners, active displays, and highlights."
        buttonText="Add Category"
        showButton={false}
        onClick={() => {
          setEditData(null);
          setOpen(true);
        }}
      />

      <DataTable data={data} columns={columns} loading={isLoading} />

      <Formik
        enableReinitialize
        initialValues={{
          name: editData?.name || "",
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
                  {editData ? "Edit category" : "Add Category"}
                </h2>
              </div>

              <div className={styles.sectionTitle}>Category Details</div>

              <Form>
                <div className={styles.formGrid}>
                  <Text
                    text="Category"
                    name="name"
                    placeholder="Enter name"
                    required={true}
                  />
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
