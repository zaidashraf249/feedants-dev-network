import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Username may only contain lowercase letters, numbers, and underscores'),
  email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(60).optional(),
    title: z.string().trim().max(120).optional(),
    company: z.string().trim().max(80).optional(),
    location: z.string().trim().max(80).optional(),
    bio: z.string().trim().max(500).optional(),
    website: z.string().trim().url().optional().or(z.literal('')),
    avatar: z.string().trim().optional(),
    coverImage: z.string().trim().optional(),
    techStack: z.array(z.string().trim()).optional(),
    socials: z
      .object({
        github: z.string().trim().optional(),
        twitter: z.string().trim().optional(),
        linkedin: z.string().trim().optional(),
      })
      .partial()
      .optional(),
  })
  .strict();
