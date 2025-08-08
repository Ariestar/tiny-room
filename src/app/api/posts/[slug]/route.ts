import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

// Handler for updating a post's content
export async function PUT(req: NextRequest, context: any) {
	try {
		const { slug } = context.params;
		const { content: newContent } = await req.json();

		if (typeof newContent !== "string") {
			return NextResponse.json({ error: "Invalid content provided." }, { status: 400 });
		}

		const fullPath = path.join(postsDirectory, `${slug}.md`);

		if (!fs.existsSync(fullPath)) {
			return NextResponse.json({ error: "Post not found." }, { status: 404 });
		}

		// Read the existing file to preserve frontmatter
		const fileContents = fs.readFileSync(fullPath, "utf8");
		const { data: frontmatter } = matter(fileContents);

		// Stringify the new content with the existing frontmatter
		const updatedFileContents = matter.stringify(newContent, frontmatter);
		fs.writeFileSync(fullPath, updatedFileContents);

		return NextResponse.json({
			message: `Post "${slug}" content updated successfully.`,
		});
	} catch (error) {
		console.error("Error updating post content:", error);
		return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
	}
}

// Handler for deleting a post
export async function DELETE(req: NextRequest, context: any) {
	try {
		const { slug } = context.params;
		const fullPath = path.join(postsDirectory, `${slug}.md`);

		if (!fs.existsSync(fullPath)) {
			return NextResponse.json({ error: "Post not found." }, { status: 404 });
		}

		fs.unlinkSync(fullPath);

		return NextResponse.json({
			message: `Post "${slug}" deleted successfully.`,
		});
	} catch (error) {
		console.error("Error deleting post:", error);
		return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
	}
}
