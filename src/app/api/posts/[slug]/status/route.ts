import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
	try {
		const { slug } = await params;
		const { status } = await req.json();

		if (!status || (status !== "publish" && status !== "draft")) {
			return NextResponse.json(
				{ error: 'Invalid status provided. Use "publish" or "draft".' },
				{ status: 400 }
			);
		}

		const fullPath = path.join(postsDirectory, `${slug}.md`);

		if (!fs.existsSync(fullPath)) {
			return NextResponse.json({ error: "Post not found." }, { status: 404 });
		}

		const fileContents = fs.readFileSync(fullPath, "utf8");
		const { data: frontmatter, content } = matter(fileContents);

		// Update the status
		frontmatter.status = status;

		const updatedFileContents = matter.stringify(content, frontmatter);
		fs.writeFileSync(fullPath, updatedFileContents);

		return NextResponse.json({
			message: `Post "${slug}" status updated to "${status}".`,
			post: { slug, status },
		});
	} catch (error) {
		console.error("Error updating post status:", error);
		return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
	}
}
