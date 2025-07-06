import { auth } from "@/auth";
import Card from "@/components/ui/Card";
import { SettingsForm } from "@/components/feature/settings/SettingsForm";
import { ApiKeyCard } from "@/components/feature/settings/ApiKeyCard";
import { MaintenanceCard } from "@/components/feature/dashboard/MaintenanceCard";

const SettingsPage = async () => {
	const session = await auth();

	if (!session?.user) {
		return (
			<div className='p-6'>
				<Card>
					<div className='p-6'>
						<h2 className='text-xl font-semibold mb-2'>Unauthorized</h2>
						<p className='text-gray-400'>You need to be signed in to view this page.</p>
					</div>
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
