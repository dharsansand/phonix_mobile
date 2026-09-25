// store/api/cartApi.js
import { api } from "./apiSlice";

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 🟢 1. Fetch Cart Items by Customer ID
    getCartItems: builder.query({
      query: (customerId) => ({
        url: `/cart/${customerId}`,
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    // 🟢 2. Add Single Item to Cart
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: "/cart",
        method: "POST",
        body: cartData,
      }),
      invalidatesTags: ["Cart"],
    }),

    // 🟢 3. Bulk Sync LocalStorage Cart on Login
    syncCart: builder.mutation({
      query: ({ customerId, items }) => ({
        url: "/cart/sync",
        method: "POST",
        body: { customerId, items },
      }),
      invalidatesTags: ["Cart"],
    }),

    // 🟢 4. Update Quantity (PATCH /cart/update-quantity)
    updateCartQuantity: builder.mutation({
      query: ({ customerId, stockId, quantity }) => ({
        url: "/cart/update-quantity",
        method: "PATCH",
        body: { customerId, stockId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    // 🟢 5. Remove Single Item (DELETE /cart/:customerId/:stockId)
    removeFromCart: builder.mutation({
      query: ({ customerId, stockId }) => ({
        url: `/cart/${customerId}/${stockId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // 🟢 6. Clear Entire Cart (DELETE /cart/clear/:customerId)
    clearCart: builder.mutation({
      query: (customerId) => ({
        url: `/cart/clear/${customerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCartItemsQuery,
  useAddToCartMutation,
  useSyncCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
