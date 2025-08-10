import fs from "fs";
import path from "path";

const galleryDirectory = path.join(process.cwd(), "gallery");

export function getSortedGalleryData() {
	// Check if gallery directory exists
	if (!fs.existsSync(galleryDirectory)) {
		console.warn("Gallery directory not found, returning empty array.");
		return [];
	}

	// Get file names under /gallery
	const fileNames = fs.readdirSync(galleryDirectory);
	const allGalleryData = fileNames.map(fileName => {
		// Remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, "");

		// For now, we just need the id.
		// In the future, you could read metadata from the files here.
		return {
			id,
		};
	});

	// For sitemap, sorting is not strictly necessary unless you want a specific order.
	return allGalleryData;
}

export function getAllGalleryIds() {
	if (!fs.existsSync(galleryDirectory)) {
		return [];
	}
	const fileNames = fs.readdirSync(galleryDirectory);

	return fileNames.map(fileName => {
		return {
			params: {
				id: fileName.replace(/\.md$/, ""),
			},
		};
	});
}
