// store/api/userApi.js
import { api } from "./apiSlice";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Me"],
    }),
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["Me"],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useGetUsersQuery, 
  useGetMeQuery 
} = userApi;