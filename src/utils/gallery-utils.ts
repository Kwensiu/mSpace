import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type GalleryEntry = CollectionEntry<"gallery">;

/**
 * 获取所有画廊精选内容并按日期排序
 */
export async function getGalleryEntries(): Promise<GalleryEntry[]> {
	const allEntries = await getCollection("gallery");
	return allEntries
		.filter((entry) => entry.data.type === "featured")
		.sort((a, b) => {
			const dateA = new Date(a.data.published);
			const dateB = new Date(b.data.published);
			return dateB.getTime() - dateA.getTime();
		});
}
