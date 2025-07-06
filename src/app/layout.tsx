import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ThemeRegistry } from "@/components/layout/ThemeRegistry";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Tiny Room - Personal Website",
	description: "A modern personal website showcasing creativity and art",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link
					rel='stylesheet'
					href='https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
					integrity='sha384-n8MVd4RsNIU0KOVEMcAgschVQEkY2zrOOvZpJn/iGu38AN2af5YWgJE27U2DHGQX'
					crossOrigin='anonymous'
				/>
			</head>
			<body className={`${inter.className} bg-background text-foreground antialiased`}>
				<ThemeRegistry attribute='class' defaultTheme='system' enableSystem>
					<div className='relative flex min-h-dvh flex-col'>
						<Header />
						<main className='flex-1'>{children}</main>
					</div>
				</ThemeRegistry>
			</body>
		</html>
	);
}
