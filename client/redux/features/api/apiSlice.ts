import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI, // Ensure this is correctly set
    credentials: "include", // Move this here to apply to all requests
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "refresh", // Adjust the endpoint as needed
        method: "GET",
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me", // Adjust the endpoint as needed
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.error("Error loading user:", error); // TypeScript will infer the type
        }
      }
      
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;