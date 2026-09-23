import { apiSlice } from './apiSlice';

export const circlesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCircles: builder.query({
      query: (category) => ({ url: '/circles', params: category ? { category } : undefined }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map((c) => ({ type: 'Circle', id: String(c._id || c.id) })), { type: 'Circle', id: 'LIST' }]
          : [{ type: 'Circle', id: 'LIST' }],
    }),

    getCircleById: builder.query({
      query: (idOrSlug) => ({ url: `/circles/${idOrSlug}` }),
      providesTags: (result, error, idOrSlug) => [{ type: 'Circle', id: idOrSlug }],
    }),

    createCircle: builder.mutation({
      query: (body) => ({ url: '/circles', method: 'POST', data: body }),
      invalidatesTags: [{ type: 'Circle', id: 'LIST' }],
    }),

    toggleJoinCircle: builder.mutation({
      query: (circleId) => ({ url: `/circles/${circleId}/join`, method: 'POST' }),
      // No invalidatesTags — cache is fully managed by onQueryStarted to avoid
      // the optimistic-update → invalidation race condition that caused button flicker.
      async onQueryStarted(circleId, { dispatch, queryFulfilled, getState }) {
        const patches = [];
        const targetId = String(circleId);
        const cacheEntries = apiSlice.util.selectCachedArgsForQuery(getState(), 'getCircles');

        // Step 1: Apply optimistic update across all getCircles cache entries.
        cacheEntries.forEach((args) => {
          patches.push(
            dispatch(
              circlesApi.util.updateQueryData('getCircles', args, (draft) => {
                const circle = draft?.data?.find((c) => String(c._id || c.id) === targetId);
                if (circle) {
                  const wasJoined = Boolean(circle.isJoined);
                  circle.isJoined = !wasJoined;
                  circle.memberCount = Math.max(0, (circle.memberCount || 0) + (wasJoined ? -1 : 1));
                }
              })
            )
          );
        });

        try {
          const { data } = await queryFulfilled;
          // Step 2: Reconcile with authoritative server state.
          // dataStore.circles.toggleJoin returns { joined: boolean, memberCount: number }
          if (data?.data) {
            cacheEntries.forEach((args) => {
              dispatch(
                circlesApi.util.updateQueryData('getCircles', args, (draft) => {
                  const circle = draft?.data?.find((c) => String(c._id || c.id) === targetId);
                  if (circle) {
                    circle.isJoined = data.data.joined;       // ✅ matches DB return shape
                    circle.memberCount = data.data.memberCount;
                  }
                })
              );
            });
          }
        } catch {
          // Step 3: Revert optimistic patch on failure.
          patches.forEach((p) => p.undo());
        }
      },
    }),
  }),
});

export const {
  useGetCirclesQuery,
  useGetCircleByIdQuery,
  useCreateCircleMutation,
  useToggleJoinCircleMutation,
} = circlesApi;

export default circlesApi;
