"use client";

import { useState, useMemo } from "react";
import { Form, Formik, FieldArray } from "formik";
import { Button, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

// Components
import PageHeader from "../../../componses/PageHeader";
import OpenModel from "../../../componses/OpenModel";
import Text from "../../../componses/Text";
import DataTable from "../../../componses/DataTable";
import CommonUpload from "../../../componses/CommonUpload";
import Select from "@/app/componses/Select";
import SearchSelect from "@/app/componses/SearchSelect";
import RichTextEditor from "@/app/componses/RichTextEditor";
import { productTypeOptions, unitOptions } from "@/app/componses/enumConfig";
import { ToastError, ToastSuccess } from "../../../componses/toast";
import styles from "../../../componses/style/openModal.module.css";
import { useGetCategoryQuery } from "@/app/store/api/categoryApi";
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "@/app/store/api/productApi";

// Helper to create empty variant with a unique temporary key
const createEmptyVariant = () => ({
  id: Math.random().toString(36).substring(2, 9), // Stable key for React rendering
  colour: "",
  colour_code: "#000000",
  size: "",
  display_size: "",
  capacity: "",
  initial_stock: "",
  original_price: "",
  content: "",
  price: "",
  description: "",
  images: [],
  slug: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
});

export default function Banner() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const { data: categoryResponse = [] } = useGetCategoryQuery();

  const categoryOptions = useMemo(() => {
    const list = Array.isArray(categoryResponse?.data)
      ? categoryResponse.data
      : Array.isArray(categoryResponse)
        ? categoryResponse
        : [];

    return list.map((item) => ({
      value: item._id,
      label: item.name,
    }));
  }, [categoryResponse]);

  const { data: banner = [], isLoading } = useGetProductQuery();
  const data = Array.isArray(banner) ? banner : [];

  const [addBanner] = useAddProductMutation();
  const [updateBanner] = useUpdateProductMutation();
  const [deleteBanner] = useDeleteProductMutation();

  const initialValues = useMemo(() => {
    return {
      producttype: editData?.producttype ?? "basic",
      name: editData?.name ?? "",
      category: editData?.category?._id ?? editData?.category ?? "",
      unit: editData?.unit ?? "",
      initial_stock:
        editData?.initial_stock !== undefined &&
        editData?.initial_stock !== null
          ? String(editData.initial_stock)
          : "",
      price:
        editData?.price !== undefined && editData?.price !== null
          ? String(editData.price)
          : "",
      original_price:
        editData?.original_price !== undefined &&
        editData?.original_price !== null
          ? String(editData.original_price)
          : "",
      content: editData?.content ?? "",
      slug: editData?.slug ?? "",
      meta_title: editData?.meta_title ?? "",
      meta_description: editData?.meta_description ?? "",
      meta_keywords: editData?.meta_keywords ?? "",
      description: editData?.description ?? "",
      productImage: editData?.productImage ?? [],
      // Inside variants.map:
      variants: editData?.variants?.length
        ? editData.variants.map((v) => ({
            id: v._id || Math.random().toString(36).substring(2, 9),
            colour: v.colour ?? "",
            colour_code: v.colour_code || "#000000",
            size: v.size ?? "",
            display_size: v.display_size ?? "",
            capacity: v.capacity ?? "",
            initial_stock:
              v.initial_stock !== undefined ? String(v.initial_stock) : "",
            price: v.price !== undefined ? String(v.price) : "",
            original_price:
              v.original_price !== undefined ? String(v.original_price) : "",
            content: v.content ?? "",
            slug: v.slug ?? "",
            meta_title: v.meta_title ?? "",
            meta_description: v.meta_description ?? "",
            meta_keywords: v.meta_keywords ?? "",
            description: v.description ?? "",
            images: v.images ?? [],
          }))
        : [createEmptyVariant()],
    };
  }, [editData]);

  const handleEdit = (record) => {
    setEditData(record);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id).unwrap();
      ToastSuccess("Product deleted successfully");
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
      const isVariant = [
        "colour",
        "colour_size",
        "colour_display",
        "colour_capacity",
      ].includes(values.producttype);

      const sanitizedVariants = (values.variants || []).map(
        ({ id, ...rest }) => ({
          ...rest,
          initial_stock: Number(rest.initial_stock || 0),
          price: Number(rest.price || 0),
        }),
      );

      const payload = {
        name: values.name,
        producttype: values.producttype,
        category: values.category,
        unit: values.unit,
        variants: isVariant ? sanitizedVariants : [],
        initial_stock: isVariant ? 0 : Number(values.initial_stock || 0),
        price: isVariant ? 0 : Number(values.price || 0),
        description: isVariant ? "" : values.description,
        productImage: isVariant ? [] : values.productImage || [],
        original_price: isVariant ? 0 : Number(values.original_price || 0),
        content: isVariant ? "" : values.content,
        slug: values.slug,
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        meta_keywords: values.meta_keywords,
      };

      if (editData) {
        await updateBanner({ id: editData._id, ...payload }).unwrap();
        ToastSuccess("Product updated successfully");
      } else {
        await addBanner(payload).unwrap();
        ToastSuccess("Product added successfully");
      }

      setOpen(false);
      setEditData(null);
      actions.resetForm();
    } catch (error) {
      console.error("error", error);
      ToastError(error?.data?.message || "Something went wrong");
    } finally {
      actions.setSubmitting(false);
    }
  };

  const columns = [
    { title: "Product Name", dataIndex: "name", key: "name" },
    { title: "Product Type", dataIndex: "producttype", key: "producttype" },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
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
        title="Product"
        subtitle="Manage product details and variants"
        buttonText="Add Product"
        onClick={() => {
          setEditData(null);
          setOpen(true);
        }}
      />

      <DataTable data={data} columns={columns} loading={isLoading} />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          const type = formik.values.producttype;
          const isVariantType = [
            "colour",
            "colour_size",
            "colour_display",
            "colour_capacity",
          ].includes(type);

          return (
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
                    {editData ? "Edit Product" : "Add Product"}
                  </h2>
                </div>

                <div className={styles.sectionTitle}>Basic Information</div>

                <Form>
                  <div className={styles.formGrid}>
                    <Select
                      text="Product Type"
                      name="producttype"
                      required={true}
                      placeholder="Choose a Product Type"
                      options={productTypeOptions}
                    />
                    <Text
                      text="Product Name"
                      name="name"
                      placeholder="Enter name"
                      required={true}
                    />
                    <SearchSelect
                      text="Select Category"
                      name="category"
                      required={true}
                      placeholder="Search & Category Name"
                      options={categoryOptions}
                    />
                    <SearchSelect
                      text="Unit"
                      name="unit"
                      required={true}
                      placeholder="Search & Unit"
                      options={unitOptions}
                    />

                    {!isVariantType && (
                      <>
                        <Text
                          text="Initial Stock"
                          name="initial_stock"
                          placeholder="Enter Initial Stock"
                          type="number"
                          required={true}
                        />
                        <Text
                          text="original price"
                          name="original_price"
                          placeholder="Enter the original price"
                          type="number"
                          required={true}
                        />
                        <Text
                          text="price"
                          name="price"
                          placeholder="Enter the price"
                          type="number"
                          required={true}
                        />

                        <Text
                          text="Content"
                          name="content"
                          placeholder="Enter the content"
                          type="text"
                          required={true}
                        />
                        <Text
                          text="Slug"
                          name="slug"
                          placeholder="Enter the slug"
                          type="text"
                          required={true}
                        />
                        <Text
                          text="meta title"
                          name="meta_title"
                          placeholder="Enter the meta title"
                          type="text"
                          required={true}
                        />
                        <Text
                          text="meta description"
                          name="meta_description"
                          placeholder="Enter the meta description"
                          type="text"
                          required={true}
                        />
                        <Text
                          text="meta keywords"
                          name="meta_keywords"
                          placeholder="Enter the meta keywords"
                          type="text"
                          required={true}
                        />
                      </>
                    )}
                  </div>

                  {/* ================= 1. DYNAMIC VARIANT ARRAY ================= */}
                  {isVariantType ? (
                    <div
                      style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.8rem",
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                          }}
                        >
                          Variant List ({type.replace("_", " ").toUpperCase()})
                        </h4>
                      </div>

                      <FieldArray name="variants">
                        {({ push, remove }) => (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "1.5rem",
                            }}
                          >
                            {formik.values.variants.map((item, index) => (
                              <div
                                // ✅ Use unique `item.id` instead of `key={index}`
                                key={item.id || index}
                                style={{
                                  background: "#f9fafb",
                                  padding: "1.25rem",
                                  borderRadius: "8px",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "1rem",
                                    borderBottom: "1px solid #e5e7eb",
                                    paddingBottom: "0.5rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color: "#374151",
                                    }}
                                  >
                                    Variant #{index + 1}
                                  </span>

                                  <Button
                                    danger
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    disabled={
                                      formik.values.variants.length === 1
                                    }
                                    onClick={() => remove(index)}
                                  >
                                    Remove Variant
                                  </Button>
                                </div>

                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      type === "colour"
                                        ? "2fr 1fr 2fr"
                                        : "2fr 1fr 2fr 2fr",
                                    gap: "0.75rem",
                                    marginBottom: "1rem",
                                  }}
                                >
                                  <Text
                                    text="Colour Name"
                                    name={`variants[${index}].colour`}
                                    placeholder="e.g. Red, Matte Black"
                                    required={true}
                                  />

                                  <div>
                                    <label
                                      style={{
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        display: "block",
                                        marginBottom: "0.35rem",
                                      }}
                                    >
                                      Color
                                    </label>
                                    <input
                                      type="color"
                                      name={`variants[${index}].colour_code`}
                                      value={
                                        formik.values.variants?.[index]
                                          ?.colour_code || "#000000"
                                      }
                                      onChange={(e) =>
                                        formik.setFieldValue(
                                          `variants[${index}].colour_code`,
                                          e.target.value,
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        height: "42px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>

                                  {type === "colour_size" && (
                                    <Text
                                      text="Size"
                                      name={`variants[${index}].size`}
                                      placeholder="e.g. S, M, L, XL"
                                      required={true}
                                    />
                                  )}

                                  {type === "colour_display" && (
                                    <Text
                                      text="Display Size"
                                      name={`variants[${index}].display_size`}
                                      placeholder="e.g. 6.1 inch, 15.6 inch"
                                      required={true}
                                    />
                                  )}

                                  {type === "colour_capacity" && (
                                    <Text
                                      text="Capacity"
                                      name={`variants[${index}].capacity`}
                                      placeholder="e.g. 64GB, 128GB, 1L"
                                      required={true}
                                    />
                                  )}

                                  <Text
                                    text="Initial Stock"
                                    name={`variants[${index}].initial_stock`}
                                    placeholder="Stock"
                                    type="number"
                                    required={true}
                                  />
                                  <Text
                                    text="original price"
                                    name={`variants[${index}].original_price`}
                                    placeholder="Enter the original price"
                                    type="number"
                                    required={true}
                                  />
                                  <Text
                                    text="price"
                                    name={`variants[${index}].price`}
                                    placeholder="Enter the price"
                                    type="number"
                                    required={true}
                                  />

                                  <Text
                                    text="Content"
                                    name={`variants[${index}].content`}
                                    placeholder="Enter the content"
                                    type="text"
                                    required={true}
                                  />
                                  <Text
                                    text="Slug"
                                    name={`variants[${index}].slug`}
                                    placeholder="Enter the slug"
                                    type="text"
                                    required={true}
                                  />
                                  <Text
                                    text="meta title"
                                    name={`variants[${index}].meta_title`}
                                    placeholder="Enter the meta title"
                                    type="text"
                                    required={true}
                                  />
                                  <Text
                                    text="meta description"
                                    name={`variants[${index}].meta_description`}
                                    placeholder="Enter the meta description"
                                    type="text"
                                    required={true}
                                  />
                                  <Text
                                    text="meta keywords"
                                    name={`variants[${index}].meta_keywords`}
                                    placeholder="Enter the meta keywords"
                                    type="text"
                                    required={true}
                                  />
                                </div>

                                <div style={{ marginBottom: "1rem" }}>
                                  <RichTextEditor
                                    text="Variant Description"
                                    name={`variants[${index}].description`}
                                    placeholder="Write variant details here..."
                                  />
                                </div>

                                <div>
                                  <CommonUpload
                                    formik={formik}
                                    name={`variants[${index}].images`}
                                    limit={5}
                                    existingImages={
                                      formik.values.variants[index]?.images
                                    }
                                    pdfimagepathname="product"
                                    settingname="product"
                                    labelName="Variant Images"
                                  />
                                </div>
                              </div>
                            ))}

                            <Button
                              type="dashed"
                              icon={<PlusOutlined />}
                              onClick={() => push(createEmptyVariant())}
                              style={{ width: "100%", padding: "0.6rem" }}
                            >
                              Add Another Variant
                            </Button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginTop: "1rem" }}>
                        <RichTextEditor
                          text="Product Description"
                          name="description"
                          required={true}
                          placeholder="Write detailed product information..."
                        />
                      </div>

                      <div style={{ marginBottom: "1.25rem" }}>
                        <CommonUpload
                          formik={formik}
                          name="productImage"
                          limit={5}
                          existingImages={formik.values.productImage}
                          pdfimagepathname="product"
                          settingname="product"
                          labelName="Product Images"
                        />
                      </div>
                    </>
                  )}

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
          );
        }}
      </Formik>
    </div>
  );
}
