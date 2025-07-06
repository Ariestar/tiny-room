"use client";

import { Card, CardContent } from "@/components/ui";
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
						<CardContent key={apiKey.key} className='p-3 bg-muted rounded-lg'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='font-semibold text-foreground'>{apiKey.name}</p>
									<p className='font-mono text-xs text-muted-foreground'>
										key_...{apiKey.key.slice(-4)}
									</p>
								</div>
								<div className='flex items-center space-x-2'>
									<Button variant='secondary' size='sm'>
										复制
									</Button>
									<Button variant='destructive' size='sm'>
										删除
									</Button>
								</div>
							</div>
						</CardContent>
					))}
				</div>
			</div>
		</Card>
	);
};
