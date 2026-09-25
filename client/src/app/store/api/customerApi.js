import { api } from "./apiSlice";

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 🟢 1. Customer Sign Up
    customerSignup: builder.mutation({
      query: (body) => ({
        url: "/customer/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),

    // 🟢 2. Customer Sign In
    customerLogin: builder.mutation({
      query: (credentials) => ({
        url: "/customer/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Customers"],
    }),

    // 🟢 3. Fetch all saved addresses
    getAddresses: builder.query({
      query: (customerId) => ({
        url: `/customer/address/${customerId}`,
        method: "GET",
      }),
      providesTags: ["CustomerAddress"],
    }),

    // 🟢 4. Save new address
    saveAddress: builder.mutation({
      query: ({ customerId, addressData }) => ({
        url: `/customer/address/${customerId}`,
        method: "POST",
        body: addressData,
      }),
      invalidatesTags: ["CustomerAddress"],
    }),

    // 🟢 5. Select active address for checkout
    selectAddress: builder.mutation({
      query: ({ customerId, addressId }) => ({
        url: `/customer/address/select/${customerId}`,
        method: "PATCH",
        body: { addressId },
      }),
      invalidatesTags: ["CustomerAddress"],
    }),

    // 🟢 6. Delete an address
    deleteAddress: builder.mutation({
      query: ({ customerId, addressId }) => ({
        url: `/customer/address/${customerId}/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CustomerAddress"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCustomerSignupMutation,
  useCustomerLoginMutation,
  useGetAddressesQuery,
  useSaveAddressMutation,
  useSelectAddressMutation,
  useDeleteAddressMutation,
} = customerApi;
