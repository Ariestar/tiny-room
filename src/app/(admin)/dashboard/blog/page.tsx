import { PrismaClient } from "@prisma/client";
import { Card, Button } from "@/components/ui";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

const prisma = new PrismaClient();

const BlogPage = async () => {
	const posts = await prisma.post.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-3xl font-bold'>Blog Posts</h1>
				<Link href={{ pathname: "/dashboard/blog/new" }}>
					<Button>
						<PlusCircle className='mr-2 h-4 w-4' />
						New Post
					</Button>
				</Link>
			</div>

			{posts.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{posts.map(post => (
						<Card key={post.id}>
							<div className='p-6'>
								<h2 className='text-xl font-semibold mb-2'>{post.title}</h2>
								<p className='text-sm text-gray-400 mb-4'>
									{new Date(post.createdAt).toLocaleDateString()}
								</p>
								<div
									className='prose prose-invert max-h-24 overflow-hidden'
									dangerouslySetInnerHTML={{
										__html: post.content?.substring(0, 150) + "..." || "",
									}}
								/>
								<div className='mt-4 flex justify-end'>
									<Link href={{ pathname: `/dashboard/blog/edit/${post.id}` }}>
										<Button variant='outline' size='sm'>
											Edit
										</Button>
									</Link>
								</div>
							</div>
						</Card>
					))}
				</div>
			) : (
				<Card>
					<div className='p-10 flex flex-col items-center justify-center text-center'>
						<h2 className='text-2xl font-semibold mb-2'>No Posts Yet</h2>
						<p className='text-gray-400 mb-6'>
							Click the button above to create your first blog post.
						</p>
						<Link href={{ pathname: "/dashboard/blog/new" }}>
							<Button>
								<PlusCircle className='mr-2 h-4 w-4' />
								Create First Post
							</Button>
						</Link>
					</div>
				</Card>
			)}
		</div>
	);
};

export default BlogPage;
