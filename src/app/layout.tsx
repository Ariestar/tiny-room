import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ThemeRegistry } from "@/components/layout/ThemeRegistry";
import { Header } from "@/components/layout/Header";
import "@/styles/globals.css";
import { fonts } from "@/lib/ui/styles";
import { generateMetadata as generateSEOMetadata } from "@/lib/system/seo/seo";

const inter = Inter({ subsets: ["latin"] });

// 视口配置
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	themeColor: "#0070f3",
};

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
					integrity='sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV'
					crossOrigin='anonymous'
				/>
			</head>
			<body
				className={`${inter.className} ${fonts.lxgwWenkai.variable} ${fonts.bookerly.variable} bg-background text-foreground antialiased`}
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
