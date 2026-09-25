"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { Button, Popconfirm, Tag, Select } from "antd";

// Reusable Components
import PageHeader from "../../../componses/PageHeader";
import OpenModel from "../../../componses/OpenModel";
import Text from "../../../componses/Text";
import DataTable from "../../../componses/DataTable";
import styles from "../../../componses/style/openModal.module.css";
import { ToastError, ToastSuccess } from "../../../componses/toast";

// RTK Query Hooks
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from "../../../store/api/orderApi";

export default function AdminOrdersPage() {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch all orders
  const { data: response = {}, isLoading } = useGetAllOrdersQuery();
  const orders =
    response?.orders ||
    response?.data ||
    (Array.isArray(response) ? response : []);

  const [updateOrderStatusApi] = useUpdateOrderStatusMutation();
  const [deleteOrderApi] = useDeleteOrderMutation();

  const handleEdit = (record) => {
    setSelectedOrder(record);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrderApi(id).unwrap();
      ToastSuccess("Order deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      ToastError("Failed to delete order");
    }
  };

  const handleCancel = (formik) => {
    formik.resetForm();
    setSelectedOrder(null);
    setOpen(false);
  };

  const handleSubmit = async (values, actions) => {
    try {
      const payload = {
        id: selectedOrder._id,
        orderStatus: values.orderStatus,
        paymentStatus: values.paymentStatus,
        trackingNumber: values.trackingNumber,
        courierPartner: values.courierPartner,
      };

      await updateOrderStatusApi(payload).unwrap();
      ToastSuccess("Order details updated successfully");

      setOpen(false);
      setSelectedOrder(null);
      actions.resetForm();
    } catch (error) {
      console.error("Update error:", error);
      ToastError(error?.data?.message || "Failed to update order");
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Ant Design Table Columns
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <strong style={{ color: "#B88A44" }}>{text}</strong>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.deliveryAddress?.name || "Guest"}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#8c7e72" }}>
            {record.deliveryAddress?.phone}
          </div>
        </div>
      ),
    },
    {
      title: "City / State",
      key: "city",
      render: (_, record) => (
        <span style={{ fontSize: "0.85rem" }}>
          {record.deliveryAddress?.city}, {record.deliveryAddress?.state}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <strong>₹{Number(amount).toLocaleString("en-IN")}</strong>
      ),
    },
    {
      title: "Payment",
      key: "paymentStatus",
      render: (_, record) => {
        const status = record.paymentStatus || "pending";
        const color =
          status === "paid" ? "green" : status === "pending" ? "orange" : "red";
        return (
          <Tag
            color={color}
            style={{ textTransform: "uppercase", fontWeight: 700 }}
          >
            {status} ({record.paymentMethod || "COD"})
          </Tag>
        );
      },
    },
    {
      title: "Order Status",
      key: "orderStatus",
      render: (_, record) => {
        const status = record.orderStatus || "placed";
        let color = "gold";
        if (status === "delivered") color = "success";
        if (status === "shipped") color = "purple";
        if (status === "processing" || status === "confirmed")
          color = "processing";
        if (status === "cancelled") color = "error";

        return (
          <Tag
            color={color}
            style={{ textTransform: "capitalize", fontWeight: 700 }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            style={{ color: "#B88A44", padding: 0, fontWeight: 600 }}
          >
            Manage
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this order?"
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
        title="Orders Management"
        subtitle="Track customer shipments, update delivery progress, and enter courier tracking."
      />

      <DataTable data={orders} columns={columns} loading={isLoading} />

      <Formik
        enableReinitialize
        initialValues={{
          orderStatus: selectedOrder?.orderStatus || "placed",
          paymentStatus: selectedOrder?.paymentStatus || "pending",
          trackingNumber: selectedOrder?.trackingNumber || "",
          courierPartner: selectedOrder?.courierPartner || "",
        }}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <OpenModel
            open={open}
            setOpen={setOpen}
            formik={formik}
            handleCancel={handleCancel}
            width={750}
          >
            <div>
              <div className={styles.modalHeader}>
                <h2 className={styles.mainTitle}>
                  Manage Order: {selectedOrder?.orderId}
                </h2>
              </div>

              {/* Order Items & Customer Overview */}
              {selectedOrder && (
                <div
                  style={{
                    background: "#fbf9f5",
                    border: "1px solid #eedfce",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.5rem",
                    fontSize: "0.88rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span>
                      <strong>Recipient:</strong>{" "}
                      {selectedOrder.deliveryAddress?.name} (
                      {selectedOrder.deliveryAddress?.phone})
                    </span>
                    <strong style={{ color: "#B88A44" }}>
                      Total: ₹
                      {Number(selectedOrder.totalAmount).toLocaleString(
                        "en-IN",
                      )}
                    </strong>
                  </div>

                  <div style={{ color: "#7d7165", marginBottom: "0.85rem" }}>
                    {selectedOrder.deliveryAddress?.streetAddress},{" "}
                    {selectedOrder.deliveryAddress?.city},{" "}
                    {selectedOrder.deliveryAddress?.state} -{" "}
                    {selectedOrder.deliveryAddress?.pincode}
                  </div>

                  <div style={{ fontWeight: 600, marginBottom: "0.4rem" }}>
                    Ordered Products:
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.35rem",
                    }}
                  >
                    {selectedOrder.items?.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#4a4036",
                        }}
                      >
                        <span>
                          • {it.name} {it.colour ? `(${it.colour})` : ""} ×{" "}
                          {it.quantity}
                        </span>
                        <span>
                          ₹
                          {Number(
                            it.totalPrice || it.price * it.quantity,
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.sectionTitle}>
                Update Status & Logistics
              </div>

              <Form>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.25rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {/* Order Status Dropdown */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                      }}
                    >
                      Order Status *
                    </label>
                    <Select
                      style={{ width: "100%", height: "42px" }}
                      value={formik.values.orderStatus}
                      onChange={(val) =>
                        formik.setFieldValue("orderStatus", val)
                      }
                      options={[
                        { label: "Placed", value: "placed" },
                        { label: "Confirmed", value: "confirmed" },
                        {
                          label: "Processing (Handcrafting)",
                          value: "processing",
                        },
                        { label: "Shipped (On The Way)", value: "shipped" },
                        { label: "Delivered", value: "delivered" },
                        { label: "Cancelled", value: "cancelled" },
                      ]}
                    />
                  </div>

                  {/* Payment Status Dropdown */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                      }}
                    >
                      Payment Status *
                    </label>
                    <Select
                      style={{ width: "100%", height: "42px" }}
                      value={formik.values.paymentStatus}
                      onChange={(val) =>
                        formik.setFieldValue("paymentStatus", val)
                      }
                      options={[
                        { label: "Pending (COD)", value: "pending" },
                        { label: "Paid", value: "paid" },
                        { label: "Failed", value: "failed" },
                        { label: "Refunded", value: "refunded" },
                      ]}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.25rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {/* Courier Partner */}
                  <Text
                    text="Courier Partner"
                    name="courierPartner"
                    placeholder="e.g. ST Courier, DTDC, Professional, Delhivery"
                  />

                  {/* Tracking Number */}
                  <Text
                    text="Tracking Number / AWB"
                    name="trackingNumber"
                    placeholder="e.g. ST102938492"
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
                    style={{ background: "#B88A44", borderColor: "#B88A44" }}
                  >
                    Save Changes
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
