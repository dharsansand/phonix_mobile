import { api } from "./apiSlice";

export const stockUpdateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStockUpdate: builder.query({
      query: () => ({
        url: "/stock-update",
        method: "GET",
      }),
      providesTags: ["StockUpdate"],
    }),
    addStockUpdate: builder.mutation({
      query: (body) => ({
        url: "/stock-update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StockUpdate"],
    }),

    updateStockUpdate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/stock-update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["StockUpdate"],
    }),

    deleteStockUpdate: builder.mutation({
      query: (id) => ({
        url: `/stock-update/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StockUpdate"],
    }),
  }),
});

export const {
  useGetStockUpdateQuery,
  useAddStockUpdateMutation,
  useUpdateStockUpdateMutation,
  useDeleteStockUpdateMutation,
} = stockUpdateApi;
