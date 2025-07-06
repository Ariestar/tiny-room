"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function Header() {
	return (
		<header className='p-4 flex justify-between items-center border-b border-border'>
			<Link href='/' className='font-bold text-lg text-foreground'>
				Tiny Room
			</Link>
			<ThemeSwitcher />
		</header>
	);
}
