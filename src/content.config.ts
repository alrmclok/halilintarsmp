// Tells Astro what a member data file looks like. Astro checks every file in src/content/members/ against this.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const members = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/members' }),
  schema: z.object({
    name: z.string(),
    handle: z.string(),
    picture: z.string().default(''),
    fandoms: z.array(z.string()),
    joined: z.string(),
    intro: z.string(),
    custom: z.boolean().default(false),
    // Optional extras for the default member page (added in Part D):
    featured: z.boolean().default(false), // true = shown in the home page "Featured member" box
    edited: z.string().default(''), // date for the "Last edited" line; empty = use the joined date
    sections: z
      .array(z.object({ heading: z.string(), text: z.string() }))
      .default([]), // article sections; a blank line in text starts a new paragraph
  }),
});

export const collections = { members };
