import { getPostDataBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditPostPage({ params }: { params: { slug: string } }) {
	let postData;
	try {
		postData = await getPostDataBySlug(params.slug);
	} catch (error) {
		// Log the error for debugging purposes on the server
		console.error(`Error fetching post data for slug: ${params.slug}`, error);
		notFound();
	}

	return (
		<div className='container mx-auto py-10'>
			<h1 className='text-3xl font-bold mb-6'>Edit Post: {postData.title}</h1>
			<EditForm post={postData} />
		</div>
	);
}
