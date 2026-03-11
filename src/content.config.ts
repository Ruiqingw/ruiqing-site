import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const photography = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/photography' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string(),
    cover: z.string(),
    images: z.array(z.string()).optional(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string(),
    category: z.enum(['essay', 'film-review', 'book-review', 'thought']).optional(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { photography, blog, essays };
