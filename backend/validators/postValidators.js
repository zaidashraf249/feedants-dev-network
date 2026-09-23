import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().trim().min(1, 'Post content is required').max(4000),
  codeSnippet: z
    .object({
      code: z.string().max(20000).optional().default(''),
      language: z.string().max(40).optional().default('javascript'),
      filename: z.string().max(120).optional().default(''),
    })
    .nullable()
    .optional(),
  image: z.string().trim().optional().default(''),
  tags: z.array(z.string().trim().max(40)).max(10).optional().default([]),
  circle: z.string().trim().nullable().optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, 'Comment content is required').max(1000),
  parentComment: z.string().trim().nullable().optional(),
});
