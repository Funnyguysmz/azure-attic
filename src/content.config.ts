import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.(md|mdx)', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
    featured: z.boolean().optional().default(false),
    image: z.string().optional(),
    lang: z.enum(['zh', 'en']).optional().default('zh'),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().optional().default(false),
    order: z.number().optional().default(99),
    lang: z.enum(['zh', 'en']).optional().default('zh'),
  }),
});

const notesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional().default([]),
    lang: z.enum(['zh', 'en']).optional().default('zh'),
  }),
});

const animeCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: "./src/content/anime" }),
  schema: z.object({
    title: z.string(),
    rating: z.number().min(1).max(5),
    status: z.enum(['watching', 'completed', 'on-hold', 'plan-to-watch']),
    watchDate: z.coerce.date().optional(),
    comment: z.string().optional(),
    image: z.string().optional(),
    lang: z.enum(['zh', 'en']).optional().default('zh'),
  }),
});

const timelineCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: "./src/content/timeline" }),
  schema: z.object({
    date: z.string(),
    title: z.string(),
    description: z.string().optional(),
    category: z.enum(['life', 'code', 'study', 'project']).optional().default('code'),
    order: z.number().optional().default(0),
    lang: z.enum(['zh', 'en']).optional().default('zh'),
  }),
});

export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection,
  'notes': notesCollection,
  'anime': animeCollection,
  'timeline': timelineCollection,
};
