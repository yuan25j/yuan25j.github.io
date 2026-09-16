import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    startDate: z.coerce.date(),
    endDate: z.union([z.coerce.date(), z.literal("Present")]),
    location: z.string().optional(),
    summary: z.string(),
    highlights: z.array(z.string()),
    skills: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    skills: z.array(z.string()),
    github: z.url().optional(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
    category: z.enum(["software", "research"]).default("software"),
    problem: z.string(),
    outcome: z.string(),
  }),
});

export const collections = { work, projects };
