import { auth } from "@/auth";
import { SettingsForm } from "@/components/feature/settings/SettingsForm";
import { ApiKeyCard } from "@/components/feature/settings/ApiKeyCard";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MaintenanceCard } from "@/components/feature/dashboard/MaintenanceCard";

const SettingsPage = async () => {
	const session = await auth();

	if (!session?.user) {
		return (
			<div className='p-6'>
				<Card>
					<CardHeader>
						<CardTitle>访问受限</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-muted-foreground'>您需要登录后才能访问此页面。</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>System Settings</h1>
			<div className='grid grid-cols-1 gap-6'>
				<SettingsForm user={session.user} />
				<ApiKeyCard />
				<MaintenanceCard />
				<Card>
					<div className='p-6'>
						<h2 className='text-xl font-semibold mb-2'>Theme Settings</h2>
						<p className='text-gray-400'>
							This section is for managing the website theme. (Coming Soon)
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default SettingsPage;
