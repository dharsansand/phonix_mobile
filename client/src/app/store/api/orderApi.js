// store/api/orderApi.js
import { api } from "./apiSlice";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 🟢 1. Customer: Place New Order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order", "Cart", "Stock"],
    }),

    // 🟢 2. Customer: Get All Orders for logged-in Customer
    getCustomerOrders: builder.query({
      query: (customerId) => ({
        url: `/order/customer/${customerId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    // 🟢 3. Customer & Admin: Get Single Order Details by ID (e.g. KC-729104)
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `/order/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    // 🟢 4. Admin: Get All Orders with Search & Pagination
    getAllOrders: builder.query({
      query: (params) => ({
        url: "/order",
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),

    // 🟢 5. Admin: Update Status, Tracking & Logistics
    updateOrderStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/order/status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Order", "Stock"],
    }),

    // 🟢 6. Admin: Delete Order
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateOrderMutation,
  useGetCustomerOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;
