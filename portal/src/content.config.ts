import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        type: z.string().optional(),
        version: z.string().optional(),
        status: z.string().optional(),
        date: z.string().optional(),
        author: z.string().optional(),
        category: z.string().optional(),
        complexity: z.string().optional(),
        tags: z.array(z.string()).optional(),
        verification_status: z.string().optional(),
      }),
    }),
  }),
};
