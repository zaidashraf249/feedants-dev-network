import { apiSlice } from './apiSlice';
import { updateUser } from '../slices/authSlice';

export const postsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ page = 1, limit = 10, tag, circle, author, search } = {}) => ({
        url: '/posts',
        params: { page, limit, tag, circle, author, search },
      }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map((post) => ({ type: 'Post', id: post._id || post.id })), { type: 'Feed', id: 'LIST' }]
          : [{ type: 'Feed', id: 'LIST' }],
      // Merge subsequent pages into one growing list for infinite-scroll style feeds
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { page, ...rest } = queryArgs || {};
        return `${endpointName}-${JSON.stringify(rest)}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!arg?.page || arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          data: [...currentCache.data, ...newItems.data],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
    }),

    getPostById: builder.query({
      query: (id) => ({ url: `/posts/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    createPost: builder.mutation({
      query: (body) => ({ url: '/posts', method: 'POST', data: body }),
      invalidatesTags: [{ type: 'Feed', id: 'LIST' }, { type: 'Trending', id: 'TAGS' }],
    }),

    updatePost: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/posts/${id}`, method: 'PATCH', data: body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),

    deletePost: builder.mutation({
      query: (id) => ({ url: `/posts/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }, { type: 'Feed', id: 'LIST' }],
    }),

    // Optimistic like toggle: the UI updates instantly, then reconciles
    // (or rolls back) once the server responds.
    toggleLikePost: builder.mutation({
      query: (id) => ({ url: `/posts/${id}/like`, method: 'POST' }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const patchResults = [];

        const cacheEntries = apiSlice.util.selectCachedArgsForQuery(getState(), 'getPosts');
        cacheEntries.forEach((args) => {
          patchResults.push(
            dispatch(
              postsApi.util.updateQueryData('getPosts', args, (draft) => {
                const post = draft?.data?.find((p) => (p._id || p.id) === id);
                if (post) {
                  const wasLiked = post.isLiked;
                  post.isLiked = !wasLiked;
                  post.likeCount = (post.likeCount || 0) + (wasLiked ? -1 : 1);
                }
              })
            )
          );
        });

        patchResults.push(
          dispatch(
            postsApi.util.updateQueryData('getPostById', id, (draft) => {
              if (draft) {
                const wasLiked = draft.isLiked;
                draft.isLiked = !wasLiked;
                draft.likeCount = (draft.likeCount || 0) + (wasLiked ? -1 : 1);
              }
            })
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
    }),

    // Optimistic bookmark toggle, mirroring the like-toggle pattern above.
    toggleBookmarkPost: builder.mutation({
      query: (id) => ({ url: `/posts/${id}/bookmark`, method: 'POST' }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const patchResults = [];
        const state = getState();
        const currentUser = state.auth.user;
        
        // Optimistically update user's bookmarks in authSlice
        if (currentUser) {
          const wasBookmarked = (currentUser.bookmarks || []).some((b) => String(b) === String(id));
          const updatedBookmarks = wasBookmarked
            ? (currentUser.bookmarks || []).filter((b) => String(b) !== String(id))
            : [...(currentUser.bookmarks || []), id];
          dispatch(updateUser({ bookmarks: updatedBookmarks }));
        }

        const cacheEntries = apiSlice.util.selectCachedArgsForQuery(state, 'getPosts');
        cacheEntries.forEach((args) => {
          patchResults.push(
            dispatch(
              postsApi.util.updateQueryData('getPosts', args, (draft) => {
                const post = draft?.data?.find((p) => String(p._id || p.id) === String(id));
                if (post) post.isBookmarked = !post.isBookmarked;
              })
            )
          );
        });
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
          // Revert authSlice update on error
          if (currentUser) {
            const wasBookmarked = (currentUser.bookmarks || []).some((b) => String(b) === String(id));
            const revertedBookmarks = wasBookmarked
              ? [...(currentUser.bookmarks || []), id]
              : (currentUser.bookmarks || []).filter((b) => String(b) !== String(id));
            dispatch(updateUser({ bookmarks: revertedBookmarks }));
          }
        }
      },
    }),

    getTrendingTags: builder.query({
      query: (limit = 6) => ({ url: '/posts/trending/tags', params: { limit } }),
      providesTags: [{ type: 'Trending', id: 'TAGS' }],
    }),

    getPostComments: builder.query({
      query: (postId) => ({ url: `/posts/${postId}/comments` }),
      providesTags: (result, error, postId) => [{ type: 'Comment', id: postId }],
    }),

    addPostComment: builder.mutation({
      query: ({ postId, content, parentComment }) => ({
        url: `/posts/${postId}/comments`,
        method: 'POST',
        data: { content, parentComment },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comment', id: postId }, { type: 'Post', id: postId }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useToggleLikePostMutation,
  useToggleBookmarkPostMutation,
  useGetTrendingTagsQuery,
  useGetPostCommentsQuery,
  useAddPostCommentMutation,
} = postsApi;

export default postsApi;
