import Card, { CardContent } from "@/components/ui/Card";

export default function DashboardProjectsPage() {
	return (
		<div>
			<h1 className='text-3xl font-bold'>Projects Management</h1>
			<p className='text-muted-foreground mt-2'>这里将展示您的项目列表。</p>
			<div className='mt-8'>
				<Card>
					<CardContent className='p-6'>
						<div className='border-dashed border-2 border-border rounded-lg h-96 flex items-center justify-center'>
							<p className='text-muted-foreground'>项目功能正在开发中...</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
