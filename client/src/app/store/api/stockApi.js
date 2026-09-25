import { api } from "./apiSlice";

export const bannerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStock: builder.query({
      query: () => ({
        url: "/stock",
        method: "GET",
      }),
      providesTags: ["Stock"],
    }),

    updateStock: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/stock/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Stock"],
    }),

    deleteStock: builder.mutation({
      query: (id) => ({
        url: `/stock/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stock"],
    }),
  }),
});

export const {
  useGetStockQuery,
  useUpdateStockMutation,
  useDeleteStockMutation,
} = bannerApi;
