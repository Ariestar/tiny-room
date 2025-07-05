"use client";

import { Card } from "@/components/ui";
import { Button } from "@/components/ui";

export const MaintenanceCard = () => {
	return (
		<Card>
			<div className='p-6'>
				<h2 className='text-xl font-semibold mb-4'>System Maintenance</h2>
				<div className='flex items-center justify-between p-3 bg-gray-800/50 rounded-lg'>
					<div>
						<p className='font-mono text-sm text-white'>Clear Cache</p>
						<p className='font-mono text-xs text-gray-400'>
							This will clear the application cache.
						</p>
					</div>
					<Button variant='destructive' onClick={() => console.log("Clearing cache...")}>
						Clear Cache
					</Button>
				</div>
			</div>
		</Card>
	);
};
