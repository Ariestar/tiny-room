import { getSortedPostsData } from "@/lib/posts";
import { DataTable, columns } from "./data-table";

export default function DashboardBlogPage() {
	const posts = getSortedPostsData();

	return (
		<div className='container mx-auto py-10'>
			<h1 className='text-3xl font-bold mb-6'>Blog Posts Management</h1>
			<DataTable columns={columns} data={posts} />
		</div>
	);
}
