import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

// {const getToken = () => {
//   return localStorage.getItem("loginToken");
// };

// export const usersApi = createApi({
//   reducerPath: "usersApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:5000/",
//     prepareHeaders: (headers, { getState }) => {
//       const token = getToken();
//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ["User", "Privilege", "SpecialBid", "Products"],
//   endpoints: (builder) => ({
//     fetchPrivileges: builder.query({
//       query: () => `api/v1/privileges`,
//       providesTags: ["Privilege"],
//     }),

//     updatePrivileges: builder.mutation({
//       query: (privilegeData) => ({
//         url: `api/v1/privileges`,
//         method: "POST",
//         body: privilegeData,
//       }),
//       invalidatesTags: ["Privilege"],
//     }),
//     fetchProducts: builder.query({
//       query: () => `/api/v1/products`,
//     }),
//     fetchSpecialBid: builder.query({
//       query: () => "api/v1/special-bids",
//     }),
//     fetchCustomerStructure: builder.query({
//       query: () => `/api/v1/customer-structure`,
//     }),
//     fetchSpecialBidById: builder.query({
//       query: (id) => `api/v1/special-bids/${id}`,
//       providesTags: (result, error, id) => [{ type: "SpecialBid", id }],
//     }),
//     addSpecialBid: builder.mutation({
//       query: (specialBidData) => ({
//         url: "api/v1/special-bids",
//         method: "POST",
//         body: specialBidData,
//       }),
//     }),
//     updateSpecialBid: builder.mutation({
//       query: ({ id, ...updateData }) => ({
//         url: `api/v1/special-bids/${id}`,
//         method: "PUT",
//         body: updateData,
//       }),
//     }),
//     deleteSpecialBid: builder.mutation({
//       query: (id) => ({
//         url: `api/v1/special-bids/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (result, error, id) => [{ type: "SpecialBid", id }],
//     }),
//   }),
// });

// export const {
//   useFetchPrivilegesQuery,
//   useUpdatePrivilegesMutation,
//   useFetchSpecialBidQuery,
//   useFetchSpecialBidByIdQuery,
//   useUpdateSpecialBidMutation,
//   useAddSpecialBidMutation,
//   useDeleteSpecialBidMutation,
//   useFetchProductsQuery,
// } = usersApi;

// export default usersApi.reducer;}

const headers = { authorization: localStorage.getItem("loginToken") };
const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "http://localhost:5000" }) =>
  async ({ url, method, data, providesTags, invalidatesTags }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        headers,
        providesTags,
        invalidatesTags,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Privileges", "SpecialBids"],
  endpoints(build) {
    return {
      getPrivileges: build.query({
        query: () => ({
          url: "/api/v1/privileges",
          method: "get",
          providesTags: ["Privileges"],
        }),
      }),
      postPrivileges: build.mutation({
        query: (privilegeData) => ({
          url: "/api/v1/privileges",
          method: "post",
          data: privilegeData, // Add this line to send privilegeData in the request body
          invalidatesTags: ["Privileges"],
        }),
      }),
      getCustomerStructure: build.query({
        query: () => ({
          url: "/api/v1/customer-structure",
          method: "get",
        }),
      }),
      getProducts: build.query({
        query: (country) => {
          let url = "/api/v1/products";
          if (country) {
            url += `?country=${encodeURIComponent(country)}`;
          }
          return { url, method: "get" };
        },
      }),
      getSpecialBids: build.query({
        query: () => ({
          url: "/api/v1/special-bids",
          method: "get",
          providesTags: ["SpecialBids"],
        }),
      }),
      getSpecialBidsById: build.query({
        query: (id) => ({
          url: `/api/v1/special-bids/${id}`,
          method: "get",
        }),
      }),
      addSpecialBids: build.mutation({
        query: (formData) => ({
          url: "/api/v1/special-bids",
          method: "post",
          data: formData,
        }),
      }),
      updateSpecialBids: build.mutation({
        query: ({ id, ...formData }) => ({
          url: `/api/v1/special-bids/${id}`,
          method: "put",
          data: formData,
        }),
      }),
      deleteSpecialBids: build.mutation({
        query: (id) => ({
          url: `/api/v1/special-bids/${id}`,
          method: "delete",
          invalidatesTags: ["SpecialBids"],
        }),
      }),
    };
  },
});

export const {
  useGetPrivilegesQuery,
  usePostPrivilegesMutation,
  useGetCustomerStructureQuery,
  useGetProductsQuery,
  useGetSpecialBidsQuery,
  useGetSpecialBidsByIdQuery,
  useAddSpecialBidsMutation,
  useUpdateSpecialBidsMutation,
  useDeleteSpecialBidsMutation,
} = usersApi;

export default usersApi.reducer;
