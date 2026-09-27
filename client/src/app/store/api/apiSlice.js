// store/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateTokens, logOut } from "../authSlice";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://ecom-website-wg9j.onrender.com/api/",
  baseUrl: "http://localhost:5000/api",
  prepareHeaders: (headers, { getState }) => {
    const token =
      getState().auth.accessToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const state = api.getState();
    const auth = state.auth || {};
    const refreshToken = auth.refreshToken;
    const user = auth.user;
    const userId = user?.id || user?._id;

    // Determine if the user is an admin or customer
    const isAdmin =
      auth.role === "admin" ||
      user?.role === "admin" ||
      (typeof window !== "undefined" &&
        (window.location.pathname.startsWith("/admin") ||
          localStorage.getItem("role") === "admin"));

    if (refreshToken && userId) {
      // Choose the right refresh endpoint depending on user type
      const refreshUrl = isAdmin
        ? "/users/refreshTokens" // Admin refresh route
        : "/customer/refreshTokens"; // Customer refresh route (or same if unified)

      const refreshResult = await baseQuery(
        {
          url: refreshUrl,
          method: "POST",
          body: { userId, refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult?.data) {
        // Update new tokens in Redux & localStorage
        api.dispatch(updateTokens(refreshResult.data));

        // Retry the original failed query
        result = await baseQuery(args, api, extraOptions);
        return result;
      }
    }

    // If no refresh token, or refresh request failed:
    api.dispatch(logOut());

    if (typeof window !== "undefined") {
      // Avoid infinite redirects if already on the login page
      const currentPath = window.location.pathname;

      if (
        isAdmin &&
        !currentPath.startsWith("/admin/login") &&
        currentPath !== "/admin"
      ) {
        window.location.href = "/admin";
      } else if (!isAdmin && currentPath !== "/login") {
        window.location.href = "/login";
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Me",
    "Users",
    "Banner",
    "Category",
    "Product",
    "Stock",
    "StockUpdate",
    "Cart",
    "Customers",
    "Wishlist",
    "CustomerAddress",
    "Order",
    "Service",
  ],
  endpoints: () => ({}),
});
