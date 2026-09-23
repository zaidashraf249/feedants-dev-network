import { z } from 'zod';

export const createCircleSchema = z.object({
  name: z.string().trim().min(2, 'Circle name is required').max(80),
  description: z.string().trim().max(400).optional().default(''),
  category: z.enum([
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
  ]),
  icon: z.string().trim().optional().default('groups'),
  color: z.string().trim().optional().default('#533afd'),
});
