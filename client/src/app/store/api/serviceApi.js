import { api } from "./apiSlice";

export const serviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 🟢 1. GET ALL SERVICES (Admin DataTable & Public Services Page)
    getService: builder.query({
      query: (params) => ({
        url: "/service",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result) ? result : result?.data || []).map(
                ({ _id }) => ({ type: "Service", id: _id }),
              ),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),

    // 🟢 2. GET SINGLE SERVICE BY SLUG OR ID (For Detail Page /services/[slug])
    getServiceBySlug: builder.query({
      query: (slug) => ({
        url: `/service/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "Service", id: slug }],
    }),

    // 🟢 3. ADD NEW SERVICE (Admin Modal)
    addService: builder.mutation({
      query: (newService) => ({
        url: "/service",
        method: "POST",
        body: newService,
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    // 🟢 4. UPDATE SERVICE (Admin Modal)
    updateService: builder.mutation({
      query: ({ id, ...updatedFields }) => ({
        url: `/service/${id}`,
        method: "PUT", // or "PATCH" depending on your NestJS controller
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),

    // 🟢 5. DELETE SERVICE (Admin Popconfirm)
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

// 🟢 Export hooks for use in Components
export const {
  useGetServiceQuery,
  useGetServiceBySlugQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
