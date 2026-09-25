import { api } from "./apiSlice";

export const bannerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomeBanners: builder.query({
      query: () => ({
        url: "/banner",
        method: "GET",
      }),
      providesTags: ["Banner"],
    }),
    getFontBanner: builder.query({
      query: () => ({
        url: "/banner/font",
        method: "GET",
      }),
      providesTags: ["Banner"],
    }),
    addBanner: builder.mutation({
      query: (body) => ({
        url: "/banner",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banner"],
    }),

    updateBanner: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/banner/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Banner"],
    }),

    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),

    toggleBannerStatus: builder.mutation({
      query: ({ id, Active }) => ({
        url: `/banner/${id}`,
        method: "PATCH",
        body: { Active },
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useGetHomeBannersQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useToggleBannerStatusMutation,
  useGetFontBannerQuery,
} = bannerApi;
