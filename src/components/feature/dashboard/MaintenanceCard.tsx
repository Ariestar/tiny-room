"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { TriangleAlert } from "lucide-react";

export const MaintenanceCard = () => {
	return (
		<Card className='bg-yellow-500/10 border-yellow-500/30'>
			<CardHeader>
				<CardTitle className='flex items-center space-x-2 text-yellow-300'>
					<TriangleAlert className='w-5 h-5' />
					<span>系统维护中</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className='font-mono text-xs text-muted-foreground'>
					我们的工程师正在努力工作，预计很快恢复。
				</p>
			</CardContent>
		</Card>
	);
};
