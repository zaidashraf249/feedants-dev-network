import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', data: body }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', data: body }),
      invalidatesTags: ['User'],
    }),
    getMe: builder.query({
      query: () => ({ url: '/auth/me' }),
      providesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery, useLazyGetMeQuery, useLogoutMutation } = authApi;

export default authApi;
