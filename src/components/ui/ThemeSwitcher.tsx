"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<circle cx='12' cy='12' r='4' />
			<path d='M12 2v2' />
			<path d='M12 20v2' />
			<path d='m4.93 4.93 1.41 1.41' />
			<path d='m17.66 17.66 1.41 1.41' />
			<path d='M2 12h2' />
			<path d='M20 12h2' />
			<path d='m4.93 19.07 1.41-1.41' />
			<path d='m17.66 6.34 1.41-1.41' />
		</svg>
	);
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
		</svg>
	);
}

export function ThemeSwitcher() {
	const [mounted, setMounted] = React.useState(false);
	const { theme, setTheme } = useTheme();

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	if (!mounted) {
		return (
			<Button variant='ghost' size='icon'>
				<SunIcon className='h-[1.2rem] w-[1.2rem]' />
			</Button>
		);
	}

	return (
		<Button variant='ghost' size='icon' onClick={toggleTheme}>
			<AnimatePresence initial={false} mode='wait'>
				<motion.div
					key={theme === "dark" ? "moon" : "sun"}
					initial={{ rotate: -90, scale: 0, opacity: 0 }}
					animate={{ rotate: 0, scale: 1, opacity: 1 }}
					exit={{ rotate: 90, scale: 0, opacity: 0 }}
					transition={{ duration: 0.2 }}
					className='flex items-center justify-center'
				>
					{theme === "dark" ? (
						<SunIcon className='h-[1.2rem] w-[1.2rem]' />
					) : (
						<MoonIcon className='h-[1.2rem] w-[1.2rem]' />
					)}
				</motion.div>
			</AnimatePresence>
			<span className='sr-only'>Toggle theme</span>
		</Button>
	);
}
