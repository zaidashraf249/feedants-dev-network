import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../../services/axiosInstance';

/**
 * A thin RTK Query `baseQuery` adapter around our shared Axios instance,
 * so every RTK Query endpoint automatically benefits from the JWT
 * injection and 401 auto-logout interceptors configured there.
 */
const axiosBaseQuery =
  () =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const result = await axiosInstance({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || { message: err.message },
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Post', 'Comment', 'User', 'Circle', 'Feed', 'Trending'],
  endpoints: () => ({}),
});

export default apiSlice;
