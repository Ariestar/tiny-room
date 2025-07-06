import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";

export default function BlogPage() {
	const allPostsData = getSortedPostsData();

	return (
		<section className='container mx-auto px-4 py-8'>
			<h1 className='text-4xl font-bold mb-8 text-foreground'>Blog</h1>
			<div className='grid gap-8'>
				{allPostsData.map(({ slug, date, title }) => (
					<article key={slug}>
						<h2 className='text-2xl font-semibold'>
							<Link
								href={`/blog/${slug}`}
								className='hover:text-primary transition-colors text-primary'
							>
								{title}
							</Link>
						</h2>
						<small className='text-muted-foreground'>
							{new Date(date).toLocaleDateString()}
						</small>
					</article>
				))}
			</div>
		</section>
	);
}
