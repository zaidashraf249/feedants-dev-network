import mongoose from 'mongoose';

const circleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Circle name is required'],
      trim: true,
      unique: true,
      maxlength: [80, 'Circle name cannot exceed 80 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: [400, 'Description cannot exceed 400 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'AI & Infra',
        'Frontend Architecture',
        'Low-Latency & WASM',
        'Systems & Backend',
        'Open Source',
        'Mobile',
        'DevOps & Cloud',
        'Security',
        'Data & ML',
        'Other',
      ],
      default: 'Other',
    },
    icon: {
      type: String,
      default: 'groups',
    },
    color: {
      type: String,
      default: '#533afd',
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    postCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

circleSchema.virtual('memberCount').get(function getMemberCount() {
  return this.members?.length || 0;
});

circleSchema.set('toJSON', { virtuals: true });
circleSchema.set('toObject', { virtuals: true });

circleSchema.pre('validate', function setSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Circle = mongoose.model('Circle', circleSchema);

export default Circle;
