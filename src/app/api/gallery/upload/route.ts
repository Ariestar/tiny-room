import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const R2_ENDPOINT = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const s3Client = new S3Client({
	region: "auto",
	endpoint: R2_ENDPOINT,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

const generateRandomString = (length: number) => crypto.randomBytes(length).toString("hex");

export async function POST(request: NextRequest) {
	try {
		const { filename, contentType } = await request.json();

		if (!filename || !contentType) {
			return NextResponse.json(
				{ error: "Filename and contentType are required" },
				{ status: 400 }
			);
		}

		const randomSuffix = generateRandomString(8);
		const uniqueFilename = `${Date.now()}-${randomSuffix}-${filename}`;

		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: uniqueFilename,
			ContentType: contentType,
		});

		const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

		const objectUrl = `${process.env.R2_PUBLIC_URL}/${uniqueFilename}`;

		return NextResponse.json({
			uploadUrl: url,
			objectUrl: objectUrl,
			key: uniqueFilename,
		});
	} catch (error) {
		console.error("Error creating pre-signed URL:", error);
		return NextResponse.json({ error: "Failed to create pre-signed URL" }, { status: 500 });
	}
}
