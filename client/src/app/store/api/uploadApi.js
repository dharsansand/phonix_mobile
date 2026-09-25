
import { api } from "./apiSlice";

export const uploadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Generic Upload Mutation
    uploadFile: builder.mutation({
      query: ({ endpoint, formData }) => ({
        url: endpoint,
        method: "POST",
        body: formData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useUploadFileMutation } = uploadApi;