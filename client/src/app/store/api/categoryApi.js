import { api } from "./apiSlice";

export const categoryApi = api.injectEndpoints({
    endpoints:(builder)=>({
        getCategory:builder.query({
            query:()=>({
                url:"/category",
                method:"GET",
            }),
      providesTags: ["Category"], 
        }),

        addCategory: builder.mutation({
      query: (body) => ({
        url: "/category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"], 
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/category/${id}`,
        method: "PUT", 
        body,
      }),
      invalidatesTags: ["Category"], 
    }),
    
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"], 
    }),

})
});

export const {
  useGetCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi