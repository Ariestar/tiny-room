import { getPostData } from "@/lib/posts";
import { Card } from "@/components/ui";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Params = {
	id: string;
};

const PostPage = async ({ params }: { params: Params }) => {
	const postData = await getPostData(params.id);

	return (
		<div>
			<Link
				href='/dashboard/blog'
				className='inline-flex items-center mb-6 text-sm text-gray-400 hover:text-gray-200'
			>
				<ArrowLeft className='mr-2 h-4 w-4' />
				Back to all posts
			</Link>
			<Card>
				<article className='p-6 md:p-8'>
					<h1 className='text-3xl font-bold mb-2'>{postData.title}</h1>
					<div className='text-gray-400 mb-6'>
						{new Date(postData.date).toLocaleDateString()}
					</div>
					<div
						className='prose prose-invert max-w-none'
						dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
					/>
				</article>
			</Card>
		</div>
	);
};

export default PostPage;
