import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-background text-foreground'>
			<div className='text-center'>
				<h1 className='text-9xl font-extrabold text-primary'>404</h1>
				<p className='text-2xl md:text-3xl font-semibold mt-4'>页面未找到</p>
				<p className='text-muted-foreground mt-2 mb-8'>抱歉，我们找不到您要查找的页面。</p>
				<Button asChild>
					<Link href='/'>返回首页</Link>
				</Button>
			</div>
		</div>
	);
}
