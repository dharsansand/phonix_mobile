import { api } from "./apiSlice";

export const bannerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProduct: builder.query({
      query: () => ({
        url: "/product",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getHomeproductCategory: builder.query({
      query: () => ({
        url: "/product/homeproductcategory",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getMainProduct: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append("search", params.search);
        if (params.category && params.category !== "all") {
          queryParams.append("category", params.category);
        }
        if (params.sort) queryParams.append("sort", params.sort);
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);

        const qs = queryParams.toString();
        return {
          url: `/product/mainproduct${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Product"],
    }),

    getProductdetails: builder.query({
      query: (id) => ({
        url: `/product/viewproduct/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    addProduct: builder.mutation({
      query: (body) => ({
        url: "/product",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductQuery,
  useGetHomeproductCategoryQuery,
  useGetMainProductQuery,
  useGetProductdetailsQuery,

  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = bannerApi;
