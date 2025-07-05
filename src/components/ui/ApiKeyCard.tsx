"use client";

import { Card } from "@/components/ui";
import { Button } from "@/components/ui";

export const ApiKeyCard = () => {
	const fakeApiKeys = [
		{
			name: "Primary Key",
			key: "tiny_sk_1234...wxyz",
			createdAt: "2023-01-15",
		},
		{
			name: "Analytics Key",
			key: "tiny_sk_5678...uvw",
			createdAt: "2023-03-20",
		},
	];

	return (
		<Card>
			<div className='p-6'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-semibold'>API Key Configuration</h2>
					<Button>Generate New Key</Button>
				</div>
				<div className='space-y-4'>
					{fakeApiKeys.map(apiKey => (
						<div
							key={apiKey.key}
							className='flex items-center justify-between p-3 bg-gray-800/50 rounded-lg'
						>
							<div>
								<p className='font-mono text-sm text-white'>{apiKey.name}</p>
								<p className='font-mono text-xs text-gray-400'>{apiKey.key}</p>
							</div>
							<div className='text-right'>
								<p className='text-xs text-gray-500'>
									Created on {apiKey.createdAt}
								</p>
								<Button variant='ghost' size='sm' className='text-red-500'>
									Revoke
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
};
