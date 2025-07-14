"use client";

import React, { useState } from "react";

const GalleryAdminPage = () => {
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
			setStatus("idle");
			setMessage("");
		}
	};

	const handleUpload = async () => {
		if (!file) {
			setMessage("Please select a file first.");
			return;
		}

		setStatus("uploading");
		setMessage("Requesting upload URL...");

		try {
			// Step 1: Get a pre-signed URL from our API
			const response = await fetch("/api/gallery/upload", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					filename: file.name,
					contentType: file.type,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to get pre-signed URL.");
			}

			const { uploadUrl, objectUrl, key } = await response.json();
			setMessage("Uploading file...");

			// Step 2: Upload the file directly to R2 using the pre-signed URL
			const uploadResponse = await fetch(uploadUrl, {
				method: "PUT",
				body: file,
				headers: {
					"Content-Type": file.type,
				},
			});

			if (!uploadResponse.ok) {
				throw new Error("File upload to R2 failed.");
			}

			setMessage(`Upload successful! File available at: ${objectUrl}`);
			setStatus("success");

			// TODO: Step 3 - Save the objectUrl and other metadata to our database
			// We will implement this in the next step.
			console.log("File uploaded successfully. Key:", key);
		} catch (error) {
			console.error(error);
			setMessage(error instanceof Error ? error.message : "An unknown error occurred.");
			setStatus("error");
		}
	};

	return (
		<div>
			<h1>Gallery Management</h1>
			<p>Upload new images to your gallery.</p>

			<div style={{ margin: "20px 0" }}>
				<input type='file' onChange={handleFileChange} accept='image/*' />
				<button onClick={handleUpload} disabled={!file || status === "uploading"}>
					{status === "uploading" ? "Uploading..." : "Upload"}
				</button>
			</div>

			{message && <p>{message}</p>}
		</div>
	);
};

export default GalleryAdminPage;
