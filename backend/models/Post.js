import mongoose from 'mongoose';

const codeSnippetSchema = new mongoose.Schema(
  {
    code: { type: String, default: '' },
    language: { type: String, default: 'javascript' },
    filename: { type: String, default: '' },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      maxlength: [4000, 'Post content cannot exceed 4000 characters'],
    },
    codeSnippet: {
      type: codeSnippetSchema,
      default: null,
    },
    image: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) => (Array.isArray(tags) ? tags.map((t) => t.toLowerCase().trim()).filter(Boolean) : []),
    },
    circle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Circle',
      default: null,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    commentCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ content: 'text', tags: 'text' });

postSchema.virtual('likeCount').get(function getLikeCount() {
  return this.likes?.length || 0;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
