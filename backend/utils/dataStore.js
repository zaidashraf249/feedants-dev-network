import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { dbState } from '../config/db.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Circle from '../models/Circle.js';
import { mockUsers, mockPosts, mockCircles, mockComments, genId } from './mockData.js';

const isLive = () => dbState.isConnected;

const AUTHOR_FIELDS = ['name', 'username', 'avatar', 'verified', 'title', 'role'];

// ---------------------------------------------------------------------------
// Mock helpers: resolve referenced sub-documents the way Mongoose's
// `.populate()` would, so controllers get an identically shaped payload
// regardless of which data source is active.
// ---------------------------------------------------------------------------
const pickPublicUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return {
    ...rest,
    followersCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,
  };
};

const pickAuthorPreview = (user) => {
  if (!user) return null;
  const preview = { _id: user._id, id: user._id };
  AUTHOR_FIELDS.forEach((field) => {
    preview[field] = user[field];
  });
  return preview;
};

const findMockUserById = (id) => mockUsers.find((u) => String(u._id) === String(id)) || null;

const hydratePost = (post) => ({
  ...post,
  id: post._id,
  author: pickAuthorPreview(findMockUserById(post.author)),
  likeCount: post.likes?.length || 0,
  isLiked: undefined,
});

const hydrateComment = (comment) => ({
  ...comment,
  id: comment._id,
  author: pickAuthorPreview(findMockUserById(comment.author)),
  likeCount: comment.likes?.length || 0,
});

const hydrateCircle = (circle) => ({
  ...circle,
  id: circle._id,
  memberCount: circle.members?.length || 0,
});

// ---------------------------------------------------------------------------
// USERS
// ---------------------------------------------------------------------------
const users = {
  async findByEmail(email, { withPassword = false } = {}) {
    if (isLive()) {
      const query = User.findOne({ email: email.toLowerCase() });
      return withPassword ? query.select('+password') : query;
    }
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    return withPassword ? user : pickPublicUser(user);
  },

  async findByUsername(username) {
    if (isLive()) {
      return User.findOne({ username: username.toLowerCase() });
    }
    const user = mockUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());
    return user ? pickPublicUser(user) : null;
  },

  async findById(id) {
    if (isLive()) {
      return User.findById(id);
    }
    const user = findMockUserById(id);
    return user ? pickPublicUser(user) : null;
  },

  async existsByEmailOrUsername(email, username) {
    if (isLive()) {
      const existing = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      });
      return existing;
    }
    return (
      mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase()
      ) || null
    );
  },

  async create({ name, username, email, password }) {
    if (isLive()) {
      const user = await User.create({ name, username, email, password });
      return user;
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      _id: genId(),
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashed,
      avatar: '',
      coverImage: '',
      role: 'member',
      title: '',
      company: '',
      location: '',
      bio: '',
      website: '',
      socials: { github: '', twitter: '', linkedin: '' },
      techStack: [],
      followers: [],
      following: [],
      circles: [],
      bookmarks: [],
      verified: false,
      isActive: true,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return pickPublicUser(newUser);
  },

  async updateById(id, updates) {
    if (isLive()) {
      return User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    }
    const user = findMockUserById(id);
    if (!user) return null;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    return pickPublicUser(user);
  },

  async toggleFollow(currentUserId, targetUserId) {
    if (isLive()) {
      const [me, target] = await Promise.all([User.findById(currentUserId), User.findById(targetUserId)]);
      if (!target) return null;
      const isFollowing = me.following.some((id) => String(id) === String(targetUserId));
      if (isFollowing) {
        me.following = me.following.filter((id) => String(id) !== String(targetUserId));
        target.followers = target.followers.filter((id) => String(id) !== String(currentUserId));
      } else {
        me.following.push(targetUserId);
        target.followers.push(currentUserId);
      }
      await Promise.all([me.save(), target.save()]);
      return { isFollowing: !isFollowing, followersCount: target.followers.length };
    }
    const me = findMockUserById(currentUserId);
    const target = findMockUserById(targetUserId);
    if (!target) return null;
    const isFollowing = me.following.some((id) => String(id) === String(targetUserId));
    if (isFollowing) {
      me.following = me.following.filter((id) => String(id) !== String(targetUserId));
      target.followers = target.followers.filter((id) => String(id) !== String(currentUserId));
    } else {
      me.following.push(targetUserId);
      target.followers.push(currentUserId);
    }
    return { isFollowing: !isFollowing, followersCount: target.followers.length };
  },

  async search(query, limit = 10) {
    if (isLive()) {
      return User.find({ $text: { $search: query } }).limit(limit);
    }
    const q = query.toLowerCase();
    return mockUsers
      .filter((u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))
      .slice(0, limit)
      .map(pickPublicUser);
  },

  async listCreators(limit = 10) {
    if (isLive()) {
      return User.find({ role: { $in: ['creator', 'staff'] } }).limit(limit);
    }
    return mockUsers.filter((u) => ['creator', 'staff'].includes(u.role)).slice(0, limit).map(pickPublicUser);
  },
};

// ---------------------------------------------------------------------------
// POSTS
// ---------------------------------------------------------------------------
const posts = {
  async list({ page = 1, limit = 10, tag, circle, author, search } = {}) {
    if (isLive()) {
      const filter = { isPublished: true };
      if (tag) filter.tags = tag.toLowerCase();
      if (circle) filter.circle = circle;
      if (author) filter.author = author;
      if (search) filter.$text = { $search: search };

      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        Post.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('author', AUTHOR_FIELDS.join(' '))
          .populate('circle', 'name slug color'),
        Post.countDocuments(filter),
      ]);
      return { items, total, page, pages: Math.ceil(total / limit) };
    }

    let items = [...mockPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (tag) items = items.filter((p) => p.tags.includes(tag.toLowerCase()));
    if (circle) items = items.filter((p) => String(p.circle) === String(circle));
    if (author) items = items.filter((p) => String(p.author) === String(author));
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((p) => p.content.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)));
    }
    const total = items.length;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit).map(hydratePost);
    return { items: paged, total, page, pages: Math.ceil(total / limit) || 1 };
  },

  async getById(id) {
    if (isLive()) {
      return Post.findById(id).populate('author', AUTHOR_FIELDS.join(' ')).populate('circle', 'name slug color');
    }
    const post = mockPosts.find((p) => String(p._id) === String(id));
    return post ? hydratePost(post) : null;
  },

  async create({ authorId, content, codeSnippet, image, tags, circle }) {
    if (isLive()) {
      const post = await Post.create({ author: authorId, content, codeSnippet, image, tags, circle });
      return Post.findById(post._id).populate('author', AUTHOR_FIELDS.join(' '));
    }
    const newPost = {
      _id: genId(),
      author: authorId,
      content,
      codeSnippet: codeSnippet || null,
      image: image || '',
      tags: Array.isArray(tags) ? tags.map((t) => t.toLowerCase().trim()).filter(Boolean) : [],
      circle: circle || null,
      likes: [],
      bookmarkedBy: [],
      comments: [],
      commentCount: 0,
      shareCount: 0,
      viewCount: 0,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPosts.unshift(newPost);
    return hydratePost(newPost);
  },

  async updateById(id, updates, requesterId) {
    if (isLive()) {
      const post = await Post.findById(id);
      if (!post) return { error: 'not_found' };
      if (String(post.author) !== String(requesterId)) return { error: 'forbidden' };
      Object.assign(post, updates);
      await post.save();
      return { post: await Post.findById(id).populate('author', AUTHOR_FIELDS.join(' ')) };
    }
    const post = mockPosts.find((p) => String(p._id) === String(id));
    if (!post) return { error: 'not_found' };
    if (String(post.author) !== String(requesterId)) return { error: 'forbidden' };
    Object.assign(post, updates, { updatedAt: new Date().toISOString() });
    return { post: hydratePost(post) };
  },

  async deleteById(id, requesterId) {
    if (isLive()) {
      const post = await Post.findById(id);
      if (!post) return { error: 'not_found' };
      if (String(post.author) !== String(requesterId)) return { error: 'forbidden' };
      await post.deleteOne();
      return { success: true };
    }
    const idx = mockPosts.findIndex((p) => String(p._id) === String(id));
    if (idx === -1) return { error: 'not_found' };
    if (String(mockPosts[idx].author) !== String(requesterId)) return { error: 'forbidden' };
    mockPosts.splice(idx, 1);
    return { success: true };
  },

  async toggleLike(postId, userId) {
    if (isLive()) {
      const post = await Post.findById(postId);
      if (!post) return null;
      const liked = post.likes.some((id) => String(id) === String(userId));
      if (liked) {
        post.likes = post.likes.filter((id) => String(id) !== String(userId));
      } else {
        post.likes.push(userId);
      }
      await post.save();
      return { liked: !liked, likeCount: post.likes.length };
    }
    const post = mockPosts.find((p) => String(p._id) === String(postId));
    if (!post) return null;
    const liked = post.likes.some((id) => String(id) === String(userId));
    if (liked) {
      post.likes = post.likes.filter((id) => String(id) !== String(userId));
    } else {
      post.likes.push(userId);
    }
    return { liked: !liked, likeCount: post.likes.length };
  },

  async toggleBookmark(postId, userId) {
    if (isLive()) {
      const [post, user] = await Promise.all([Post.findById(postId), User.findById(userId)]);
      if (!post || !user) return null;
      const bookmarked = post.bookmarkedBy.some((id) => String(id) === String(userId));
      if (bookmarked) {
        post.bookmarkedBy = post.bookmarkedBy.filter((id) => String(id) !== String(userId));
        user.bookmarks = user.bookmarks.filter((id) => String(id) !== String(postId));
      } else {
        post.bookmarkedBy.push(userId);
        user.bookmarks.push(postId);
      }
      await Promise.all([post.save(), user.save()]);
      return { bookmarked: !bookmarked };
    }
    const post = mockPosts.find((p) => String(p._id) === String(postId));
    const user = findMockUserById(userId);
    if (!post || !user) return null;
    const bookmarked = post.bookmarkedBy.some((id) => String(id) === String(userId));
    if (bookmarked) {
      post.bookmarkedBy = post.bookmarkedBy.filter((id) => String(id) !== String(userId));
      user.bookmarks = user.bookmarks.filter((id) => String(id) !== String(postId));
    } else {
      post.bookmarkedBy.push(userId);
      user.bookmarks.push(postId);
    }
    return { bookmarked: !bookmarked };
  },

  async trendingTags(limit = 6) {
    if (isLive()) {
      const results = await Post.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]);
      return results.map((r) => ({ tag: r._id, count: r.count }));
    }
    const counts = {};
    mockPosts.forEach((p) => p.tags.forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));
  },
};

// ---------------------------------------------------------------------------
// COMMENTS
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// COMMENTS
// ---------------------------------------------------------------------------
const comments = {
  async listForPost(postId) {
    if (isLive()) {
      // String ID ko Safe ObjectId conversion ya query fallback dena
      const validPostId = mongoose.Types.ObjectId.isValid(postId)
        ? new mongoose.Types.ObjectId(postId)
        : postId;

      return Comment.find({ post: validPostId })
        .sort({ createdAt: -1 })
        .populate('author', AUTHOR_FIELDS.join(' '));
    }

    return mockComments
      .filter((c) => String(c.post || c.postId) === String(postId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(hydrateComment);
  },

  async create({ postId, authorId, content, parentComment }) {
    if (isLive()) {
      const validPostId = mongoose.Types.ObjectId.isValid(postId)
        ? new mongoose.Types.ObjectId(postId)
        : postId;

      const comment = await Comment.create({
        post: validPostId,
        author: authorId,
        content,
        parentComment: parentComment || null,
      });

      await Post.findByIdAndUpdate(validPostId, {
        $inc: { commentCount: 1 },
        $push: { comments: comment._id },
      });

      return Comment.findById(comment._id).populate('author', AUTHOR_FIELDS.join(' '));
    }

    const newComment = {
      _id: genId(),
      post: postId,
      author: authorId,
      content,
      parentComment: parentComment || null,
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockComments.push(newComment);
    const post = mockPosts.find((p) => String(p._id) === String(postId));
    if (post) {
      post.commentCount += 1;
      post.comments = post.comments || [];
      post.comments.push(newComment._id);
    }
    return hydrateComment(newComment);
  },
};

// ---------------------------------------------------------------------------
// CIRCLES
// ---------------------------------------------------------------------------
const circles = {
  async list({ category } = {}) {
    if (isLive()) {
      const filter = category ? { category } : {};
      return Circle.find(filter).sort({ memberCount: -1, createdAt: -1 });
    }
    let items = [...mockCircles];
    if (category) items = items.filter((c) => c.category === category);
    return items.sort((a, b) => (b.members.length || 0) - (a.members.length || 0)).map(hydrateCircle);
  },

  async getById(id) {
    if (isLive()) {
      return Circle.findById(id);
    }
    const circle = mockCircles.find((c) => String(c._id) === String(id));
    return circle ? hydrateCircle(circle) : null;
  },

  async getBySlug(slug) {
    if (isLive()) {
      return Circle.findOne({ slug });
    }
    const circle = mockCircles.find((c) => c.slug === slug);
    return circle ? hydrateCircle(circle) : null;
  },

  async toggleJoin(circleId, userId) {
    if (isLive()) {
      const [circle, user] = await Promise.all([Circle.findById(circleId), User.findById(userId)]);
      if (!circle || !user) return null;
      const isMember = circle.members.some((id) => String(id) === String(userId));
      if (isMember) {
        circle.members = circle.members.filter((id) => String(id) !== String(userId));
        user.circles = user.circles.filter((id) => String(id) !== String(circleId));
      } else {
        circle.members.push(userId);
        user.circles.push(circleId);
      }
      await Promise.all([circle.save(), user.save()]);
      return { joined: !isMember, memberCount: circle.members.length };
    }
    const circle = mockCircles.find((c) => String(c._id) === String(circleId));
    const user = findMockUserById(userId);
    if (!circle || !user) return null;
    const isMember = circle.members.some((id) => String(id) === String(userId));
    if (isMember) {
      circle.members = circle.members.filter((id) => String(id) !== String(userId));
      user.circles = user.circles.filter((id) => String(id) !== String(circleId));
    } else {
      circle.members.push(userId);
      user.circles.push(circleId);
    }
    return { joined: !isMember, memberCount: circle.members.length };
  },
};

export const dataStore = { users, posts, comments, circles, isLive };

export default dataStore;
