import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ThemeRegistry } from "@/components/layout/ThemeRegistry";
import { Header } from "@/components/layout/Header";
import "@/styles/globals.css";
import { lxgwWenkai, bookerly } from "@/lib/fonts";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

// 生成页面元数据
export const metadata: Metadata = generateSEOMetadata({
	title: "Tiny Room",
	description: "一个有趣且富有个性的个人博客空间，展现创意与技术的完美融合。分享技术见解、学习心得和创意想法。",
	keywords: [
		"个人博客", "技术博客", "前端开发", "全栈开发", "React", "Next.js",
		"TypeScript", "JavaScript", "Web开发", "编程", "技术分享", "创意设计"
	],
	url: "/",
	type: "website"
});

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
			<body
				className={`${inter.className} ${lxgwWenkai.variable} ${bookerly.variable} bg-background text-foreground antialiased`}
			>
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
