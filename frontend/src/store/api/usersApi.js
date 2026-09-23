import { apiSlice } from './apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: (username) => ({ url: `/users/${username}` }),
      providesTags: (result, error, username) => [{ type: 'User', id: username }],
    }),

    updateMyProfile: builder.mutation({
      query: (body) => ({ url: '/users/me', method: 'PATCH', data: body }),
      invalidatesTags: ['User'],
    }),

    toggleFollowUser: builder.mutation({
      query: (userId) => ({ url: `/users/${userId}/follow`, method: 'POST' }),
      // No invalidatesTags — cache is fully managed by onQueryStarted to avoid
      // the optimistic-update → invalidation race condition that caused button flicker.
      async onQueryStarted(userId, { dispatch, queryFulfilled, getState }) {
        const patches = [];
        const targetId = String(userId);

        // Step 1a: Optimistic update on getCreators cache (all limit variants share
        // a single entry now that both pages use limit=8).
        const creatorsCacheEntries = apiSlice.util.selectCachedArgsForQuery(getState(), 'getCreators');
        creatorsCacheEntries.forEach((args) => {
          patches.push(
            dispatch(
              usersApi.util.updateQueryData('getCreators', args, (draft) => {
                if (draft?.data) {
                  const creator = draft.data.find((c) => String(c._id || c.id) === targetId);
                  if (creator) {
                    const wasFollowing = Boolean(creator.isFollowing);
                    creator.isFollowing = !wasFollowing;
                    creator.followersCount = Math.max(0, (creator.followersCount || 0) + (wasFollowing ? -1 : 1));
                  }
                }
              })
            )
          );
        });

        // Step 1b: Optimistic update on getUserProfile cache (for profile page button).
        const profileCacheEntries = apiSlice.util.selectCachedArgsForQuery(getState(), 'getUserProfile');
        profileCacheEntries.forEach((username) => {
          patches.push(
            dispatch(
              usersApi.util.updateQueryData('getUserProfile', username, (draft) => {
                if (draft?.data?.user && String(draft.data.user._id || draft.data.user.id) === targetId) {
                  const wasFollowing = Boolean(draft.data.user.isFollowing);
                  draft.data.user.isFollowing = !wasFollowing;
                  if (draft.data.stats) {
                    draft.data.stats.followersCount = Math.max(
                      0,
                      (draft.data.stats.followersCount || 0) + (wasFollowing ? -1 : 1)
                    );
                  }
                }
              })
            )
          );
        });

        try {
          const { data: resData } = await queryFulfilled;
          // Step 2: Reconcile with authoritative server state.
          // dataStore.users.toggleFollow returns { isFollowing: boolean, followersCount: number }
          const serverResult = resData?.data;
          if (serverResult) {
            creatorsCacheEntries.forEach((args) => {
              dispatch(
                usersApi.util.updateQueryData('getCreators', args, (draft) => {
                  if (draft?.data) {
                    const creator = draft.data.find((c) => String(c._id || c.id) === targetId);
                    if (creator) {
                      creator.isFollowing = serverResult.isFollowing;
                      creator.followersCount = serverResult.followersCount;
                    }
                  }
                })
              );
            });
          }
        } catch {
          // Step 3: Revert optimistic patches on failure.
          patches.forEach((p) => p.undo());
        }
      },
    }),

    searchUsers: builder.query({
      query: (q) => ({ url: '/users/search', params: { q } }),
    }),

    getCreators: builder.query({
      query: (limit = 8) => ({ url: '/users/creators', params: { limit } }),
      providesTags: [{ type: 'User', id: 'CREATORS' }],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateMyProfileMutation,
  useToggleFollowUserMutation,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useGetCreatorsQuery,
} = usersApi;

export default usersApi;
