// store/api/wishlistApi.js
import { api } from "./apiSlice";

export const wishlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: (customerId) => ({
        url: `/wishlist/${customerId}`,
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),

    toggleWishlist: builder.mutation({
      query: (wishlistData) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body: wishlistData,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    syncWishlist: builder.mutation({
      query: ({ customerId, items }) => ({
        url: "/wishlist/sync",
        method: "POST",
        body: { customerId, items },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation({
      query: ({ customerId, stockId }) => ({
        url: `/wishlist/${customerId}/${stockId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    clearWishlist: builder.mutation({
      query: (customerId) => ({
        url: `/wishlist/clear/${customerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useSyncWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;
