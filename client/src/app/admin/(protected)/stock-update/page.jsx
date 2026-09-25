"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Form, Formik, FieldArray, useFormikContext } from "formik";
import { Button, Popconfirm, InputNumber, Select, Tag } from "antd";

// Components
import PageHeader from "../../../componses/PageHeader";
import OpenModel from "../../../componses/OpenModel";
import DataTable from "../../../componses/DataTable";
import styles from "../../../componses/style/openModal.module.css";

import { ToastError, ToastSuccess } from "../../../componses/toast";
import { useGetStockQuery } from "@/app/store/api/stockApi";
import SearchSelect from "@/app/componses/SearchSelect";
import {
  useAddStockUpdateMutation,
  useDeleteStockUpdateMutation,
  useGetStockUpdateQuery,
  useUpdateStockUpdateMutation,
} from "@/app/store/api/stockupdate";

// Helper to safely extract String ID
const extractId = (val) => {
  if (!val) return "";
  if (typeof val === "object") {
    return String(val._id || val.value || val.target?.value || "");
  }
  return String(val);
};

// Auto-updates Formik "stocks" only when Product ACTUALLY changes (not during Edit)
function StockVariantsWatcher({ stockList, editData }) {
  const { values, setFieldValue } = useFormikContext();
  const isFirstRender = useRef(true);
  const prevProductId = useRef(extractId(editData?.product));

  // Reset tracking when editData changes
  useEffect(() => {
    isFirstRender.current = true;
    prevProductId.current = extractId(editData?.product);
  }, [editData]);

  useEffect(() => {
    const selectedProductId = extractId(values.product);

    // 1. If in Edit Mode and it's the first render, DO NOT overwrite saved stocks!
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (editData && values.stocks?.length > 0) {
        return;
      }
    }

    // 2. If the product ID hasn't actually changed, do nothing
    if (
      prevProductId.current === selectedProductId &&
      values.stocks?.length > 0
    ) {
      return;
    }
    prevProductId.current = selectedProductId;

    if (!selectedProductId) {
      setFieldValue("stocks", []);
      return;
    }

    // 3. Populate fresh variants for a new product selection
    const matchingStocks = stockList.filter((item) => {
      const pId = extractId(item.product);
      return pId === selectedProductId;
    });

    const formattedStocks = matchingStocks.map((stock) => ({
      stockId: stock._id,
      variantId: stock.variantId,
      colour: stock.colour || "—",
      size: stock.size || "—",
      capacity: stock.capacity || "—",
      displaysize: stock.displaysize || "—",
      currentQuantity: Number(stock.quantity) || 0,
      currentPrice: Number(stock.price) || 0, // View Current Price
      newPrice: Number(stock.price) || 0, // Editable New Price
      currentOriginalPrice: Number(stock.original_price || stock.price || 0),
      newOriginalPrice: Number(stock.original_price || stock.price || 0),
      actionType: "add",
      changeQuantity: 0,
    }));

    setFieldValue("stocks", formattedStocks);
  }, [values.product, stockList, setFieldValue, editData]);

  return null;
}

export default function Banner() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch stocks
  const { data: stockResponse = [] } = useGetStockQuery();

  const stockList = useMemo(() => {
    return Array.isArray(stockResponse?.data)
      ? stockResponse.data
      : Array.isArray(stockResponse)
        ? stockResponse
        : [];
  }, [stockResponse]);

  // Unique product options for dropdown
  const productOptions = useMemo(() => {
    const uniqueProducts = new Map();

    stockList.forEach((item) => {
      const productId = extractId(item.product);
      const productName =
        typeof item.product === "object" && item.product?.name
          ? item.product.name
          : item.name || `Product (${productId.slice(-6)})`;

      if (productId && !uniqueProducts.has(productId)) {
        uniqueProducts.set(productId, {
          value: productId,
          label: productName,
        });
      }
    });

    return Array.from(uniqueProducts.values());
  }, [stockList]);

  // Get Stock Update List
  const { data: banner = [], isLoading } = useGetStockUpdateQuery();
  const data = Array.isArray(banner?.data)
    ? banner.data
    : Array.isArray(banner)
      ? banner
      : [];

  const [addStockUpdate] = useAddStockUpdateMutation();
  const [updateStockUpdate] = useUpdateStockUpdateMutation();
  const [deleteStockUpdate] = useDeleteStockUpdateMutation();

  const handleEdit = (record) => {
    setEditData(record);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStockUpdate(id).unwrap();
      ToastSuccess("Deleted successfully");
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
      const payload = {
        product: extractId(values.product),
        stocks: values.stocks.map((item) => {
          const current = Number(item.currentQuantity) || 0;
          const change = Number(item.changeQuantity) || 0;
          const finalQuantity =
            item.actionType === "return"
              ? Math.max(0, current - change)
              : current + change;

          return {
            stockId: item.stockId,
            variantId: item.variantId,
            colour: item.colour || "",
            size: item.size || "",
            capacity: item.capacity || "",
            displaysize: item.displaysize || "",
            currentQuantity: current,
            currentPrice: Number(item.currentPrice) || 0, // Old Price
            price: Number(item.newPrice) || Number(item.currentPrice) || 0, // New Updated Price
            original_price:
              Number(item.newOriginalPrice) ||
              Number(item.currentOriginalPrice) ||
              0, // New Updated Original Price
            currentOriginalPrice: Number(item.currentOriginalPrice) || 0,
            changeQuantity: change,
            finalQuantity: finalQuantity,
            actionType: item.actionType,
            changeQuantity: change,
            finalQuantity: finalQuantity,
          };
        }),
      };

      if (editData) {
        await updateStockUpdate({ id: editData._id, ...payload }).unwrap();
        ToastSuccess("Stock updated successfully");
      } else {
        await addStockUpdate(payload).unwrap();
        ToastSuccess("Stock added successfully");
      }

      setOpen(false);
      setEditData(null);
      actions.resetForm();
    } catch (error) {
      console.error(error);
      ToastError(error?.data?.message || "Something went wrong");
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
      title: "Updated Items",
      dataIndex: "stocks",
      key: "stocks",
      render: (stocks) => (
        <Tag color="geekblue">{stocks?.length || 0} variants</Tag>
      ),
    },
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
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <PageHeader
        title="Stock Management"
        subtitle="Add or return stock variants."
        buttonText="Add / Return Stock"
        onClick={() => {
          setEditData(null);
          setOpen(true);
        }}
      />

      <DataTable data={data} columns={columns} loading={isLoading} />

      <Formik
        enableReinitialize
        initialValues={{
          product: extractId(editData?.product) || "",
          stocks:
            editData?.stocks?.map((item) => ({
              stockId: item.stockId,
              variantId: item.variantId,
              colour: item.colour || "—",
              size: item.size || "—",
              capacity: item.capacity || "—",
              displaysize: item.displaysize || "—",
              currentQuantity: Number(item.currentQuantity) || 0,
              currentPrice: Number(item.currentPrice ?? item.price) || 0,
              currentOriginalPrice: Number(
                item.currentOriginalPrice ?? item.originalPrice ?? 0,
              ),
              newOriginalPrice: Number(
                item.original_price ?? item.newOriginalPrice ?? 0,
              ),
              newPrice: Number(item.price ?? item.newPrice) || 0,
              actionType: item.actionType || "add",
              changeQuantity: Number(item.changeQuantity) || 0,
            })) || [],
        }}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <OpenModel
            open={open}
            setOpen={setOpen}
            formik={formik}
            handleCancel={handleCancel}
            width={1000}
          >
            <div>
              <StockVariantsWatcher stockList={stockList} editData={editData} />

              <div className={styles.modalHeader}>
                <h2 className={styles.mainTitle}>
                  {editData ? "View / Edit Stock Update" : "Stock In / Return"}
                </h2>
              </div>

              <Form>
                <div className={styles.formGrid}>
                  <SearchSelect
                    text="Select Product"
                    name="product"
                    required={true}
                    placeholder="Search & Select Product"
                    options={productOptions}
                    disabled={!!editData}
                  />
                </div>

                {/* Variants List */}
                <div style={{ marginTop: "1.5rem" }}>
                  <FieldArray name="stocks">
                    {() => (
                      <div>
                        {formik.values.stocks?.length > 0 && (
                          <div className={styles.sectionTitle}>
                            Manage Variants Stock & Price
                          </div>
                        )}

                        {formik.values.stocks?.length > 0 ? (
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              marginTop: "0.5rem",
                            }}
                          >
                            <thead>
                              <tr
                                style={{
                                  textAlign: "left",
                                  borderBottom: "1px solid #e5e7eb",
                                  background: "#f9fafb",
                                }}
                              >
                                <th style={{ padding: "10px" }}>Variant</th>
                                <th style={{ padding: "10px" }}>
                                  Original Current Price
                                </th>
                                <th style={{ padding: "10px", width: "130px" }}>
                                  Original New Price
                                </th>
                                <th style={{ padding: "10px" }}>
                                  Current Price
                                </th>
                                <th style={{ padding: "10px", width: "130px" }}>
                                  New Price
                                </th>

                                <th style={{ padding: "10px" }}>
                                  Current Stock
                                </th>

                                <th style={{ padding: "10px", width: "120px" }}>
                                  Action
                                </th>
                                <th style={{ padding: "10px", width: "110px" }}>
                                  Qty
                                </th>
                                <th style={{ padding: "10px" }}>New Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formik.values.stocks.map((item, index) => {
                                const current =
                                  Number(item.currentQuantity) || 0;
                                const change = Number(item.changeQuantity) || 0;
                                const newTotal =
                                  item.actionType === "return"
                                    ? Math.max(0, current - change)
                                    : current + change;

                                return (
                                  <tr
                                    key={
                                      item.stockId || item.variantId || index
                                    }
                                    style={{
                                      borderBottom: "1px solid #f3f4f6",
                                    }}
                                  >
                                    {/* Variant Info */}
                                    <td style={{ padding: "10px" }}>
                                      <div>
                                        <strong>Colour:</strong> {item.colour}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          color: "#666",
                                        }}
                                      >
                                        {item.size && `Size: ${item.size} | `}
                                        {item.capacity &&
                                          `Cap: ${item.capacity}`}
                                      </div>
                                    </td>

                                    <td style={{ padding: "10px" }}>
                                      <Tag color="purple">
                                        ₹{item.currentOriginalPrice}
                                      </Tag>
                                    </td>
                                    <td style={{ padding: "10px" }}>
                                      <InputNumber
                                        min={0}
                                        prefix="₹"
                                        placeholder="New Price"
                                        style={{ width: "100%" }}
                                        value={item.newOriginalPrice}
                                        disabled={!!editData}
                                        onChange={(val) =>
                                          formik.setFieldValue(
                                            `stocks.${index}.newOriginalPrice`,
                                            val ?? 0,
                                          )
                                        }
                                      />
                                    </td>

                                    <td style={{ padding: "10px" }}>
                                      <Tag color="purple">
                                        ₹{item.currentPrice}
                                      </Tag>
                                    </td>

                                    {/* 2. NEW PRICE (EDITABLE INPUT) */}
                                    <td style={{ padding: "10px" }}>
                                      <InputNumber
                                        min={0}
                                        prefix="₹"
                                        placeholder="New Price"
                                        style={{ width: "100%" }}
                                        value={item.newPrice}
                                        disabled={!!editData}
                                        onChange={(val) =>
                                          formik.setFieldValue(
                                            `stocks.${index}.newPrice`,
                                            val ?? 0,
                                          )
                                        }
                                      />
                                    </td>

                                    {/* Current Stock */}
                                    <td style={{ padding: "10px" }}>
                                      <Tag color="blue">{current}</Tag>
                                    </td>

                                    {/* Action: Add or Return */}
                                    <td style={{ padding: "10px" }}>
                                      <Select
                                        value={item.actionType}
                                        style={{ width: "100%" }}
                                        disabled={!!editData}
                                        onChange={(val) =>
                                          formik.setFieldValue(
                                            `stocks.${index}.actionType`,
                                            val,
                                          )
                                        }
                                        options={[
                                          { label: "➕ Add", value: "add" },
                                          {
                                            label: "↩️ Return",
                                            value: "return",
                                          },
                                        ]}
                                      />
                                    </td>

                                    {/* Quantity to Add or Return */}
                                    <td style={{ padding: "10px" }}>
                                      <InputNumber
                                        min={0}
                                        placeholder="0"
                                        style={{ width: "100%" }}
                                        disabled={!!editData}
                                        value={item.changeQuantity}
                                        onChange={(val) =>
                                          formik.setFieldValue(
                                            `stocks.${index}.changeQuantity`,
                                            val ?? 0,
                                          )
                                        }
                                      />
                                    </td>

                                    {/* Calculated Final Stock */}
                                    <td style={{ padding: "10px" }}>
                                      <Tag
                                        color={
                                          item.actionType === "return"
                                            ? "volcano"
                                            : "green"
                                        }
                                      >
                                        {newTotal}
                                      </Tag>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          formik.values.product && (
                            <p style={{ color: "#888", marginTop: "1rem" }}>
                              No stock variants found for this product.
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </FieldArray>
                </div>

                {!editData && (
                  <div
                    className={styles.footerButtons}
                    style={{ marginTop: "2rem" }}
                  >
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
                      Save
                    </Button>
                  </div>
                )}
              </Form>
            </div>
          </OpenModel>
        )}
      </Formik>
    </div>
  );
}
