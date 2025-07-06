"use client";

import * as React from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button"; // Using our custom button

// A very simple component to render the markdown preview
const renderMarkdown = (markdown: string) => {
	return Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>);
};

type Post = {
	slug: string;
	content: string;
	status: string;
	// Add other post fields if needed
};

interface EditFormProps {
	post: Post;
}

export default function EditForm({ post }: EditFormProps) {
	const router = useRouter();
	const [value, setValue] = React.useState(post.content);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">("write");

	const handleStatusChange = async (newStatus: "publish" | "draft") => {
		setIsSubmitting(true);
		try {
			const response = await fetch(`/api/posts/${post.slug}/status`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});
			if (!response.ok) throw new Error("Failed to update status.");
			router.refresh(); // Refresh page to show new status
		} catch (error) {
			console.error(error);
			// TODO: Add user-facing error notification
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (
			window.confirm(
				"Are you sure you want to delete this post? This action cannot be undone."
			)
		) {
			setIsSubmitting(true);
			try {
				const response = await fetch(`/api/posts/${post.slug}`, { method: "DELETE" });
				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || "Failed to delete post.");
				}
				// On successful deletion, redirect to the blog dashboard
				router.push("/dashboard/blog");
			} catch (error) {
				console.error(error);
				// TODO: Add user-facing error notification (e.g., a toast)
				alert(
					`Error deleting post: ${error instanceof Error ? error.message : String(error)}`
				);
				setIsSubmitting(false);
			}
		}
	};

	const handleSave = async (data: string) => {
		setIsSubmitting(true);
		try {
			const response = await fetch(`/api/posts/${post.slug}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: data }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save post.");
			}
			// Optionally, refresh data or show a success message
			router.refresh();
			alert("Draft saved successfully!"); // Simple feedback
		} catch (error) {
			console.error(error);
			alert(`Error saving post: ${error instanceof Error ? error.message : String(error)}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<div className='prose lg:prose-xl dark:prose-invert max-w-none'>
				<ReactMde
					value={value}
					onChange={setValue}
					selectedTab={selectedTab}
					onTabChange={setSelectedTab}
					generateMarkdownPreview={markdown => renderMarkdown(markdown)}
					childProps={{
						writeButton: {
							tabIndex: -1,
						},
					}}
				/>
			</div>
			<div className='mt-8 flex justify-between items-center'>
				<div>
					<Button
						variant='destructive'
						size='sm'
						onClick={handleDelete}
						loading={isSubmitting}
					>
						Delete
					</Button>
				</div>
				<div className='flex space-x-4'>
					<Button
						variant='secondary'
						onClick={() => handleSave(value)}
						loading={isSubmitting}
					>
						Save Draft
					</Button>
					{post.status !== "publish" ? (
						<Button
							variant='success'
							onClick={() => handleStatusChange("publish")}
							loading={isSubmitting}
						>
							Publish
						</Button>
					) : (
						<Button
							variant='outline'
							onClick={() => handleStatusChange("draft")}
							loading={isSubmitting}
						>
							Unpublish
						</Button>
					)}
				</div>
			</div>
		</>
	);
}
