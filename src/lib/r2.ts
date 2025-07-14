"use server";

import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

export async function listImages() {
	try {
		const listCommand = new ListObjectsV2Command({
			Bucket: process.env.R2_BUCKET_NAME!,
		});

		const { Contents } = await s3Client.send(listCommand);
		if (!Contents) {
			return [];
		}
		// Sort by LastModified date, newest first
		const sortedContents = Contents.sort(
			(a, b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0)
		);

		const images = await Promise.all(
			sortedContents.map(async image => {
				if (!image.Key) return null;
				const getCommand = new GetObjectCommand({
					Bucket: process.env.R2_BUCKET_NAME!,
					Key: image.Key,
				});
				// Generate a pre-signed URL valid for 1 hour
				const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
				return {
					key: image.Key,
					url: url,
					uploadedAt: image.LastModified,
				};
			})
		);

		// Filter out any null values that may have occurred
		return images.filter((image): image is NonNullable<typeof image> => image !== null);
	} catch (error) {
		console.error("Error listing images from R2:", error);
		return [];
	}
}
