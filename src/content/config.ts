import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),

		/* Language versions */
		en: z.string().optional(),
		cn: z.string().optional(),

		/* Pin functionality */
		pin: z.boolean().optional().default(false),
		pinOrder: z.number().optional().default(999),

		/* Hidden functionality */
		hidden: z.enum(["none", "part", "all"]).optional().default("none"),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});

const galleryCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string(),
		location: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().default(""),
		lang: z.string().optional().default(""),
		type: z.enum(["featured", "travel"]).optional().default("featured"),
		logo: z.string().optional(), // 添加logo属性
	}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
	gallery: galleryCollection,
};