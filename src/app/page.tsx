"use client";

import { HeroSection, ContentSection } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { DynamicBackground } from "@/components/animation/DynamicBackground";
import { MouseFollowParticles } from "@/components/animation/MouseFollowParticles";
import { AnimatedGradient } from "@/components/animation/AnimatedGradient";
import { PersonalizedGreeting } from "@/components/animation/PersonalizedGreeting";
import { TypewriterText } from "@/components/animation/TypewriterText";
import { InteractiveElements } from "@/components/animation/InteractiveElements";
import { MicroInteraction } from "@/components/animation/MicroInteractions";
import { CreativeCard, CardContent } from "@/components/ui/CreativeCard";
import { BlogPreview } from "@/components/feature/blog/BlogPreview";
import { ProjectShowcase } from "@/components/feature/projects/ProjectShowcase";
import { PersonalIntro } from "@/components/feature/personal/PersonalIntro";
import { SocialLinks } from "@/components/feature/contact/SocialLinks";
import { ContactInfo } from "@/components/feature/contact/ContactInfo";
import { InteractiveEasterEggs } from "@/components/feature/contact/InteractiveEasterEggs";
import { ScrollRevealContainer, ScrollRevealItem } from "@/components/animation/ScrollReveal";
import { HomepageStructuredData } from "@/components/seo/StructuredData";
import { useState, useEffect } from "react";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/seo";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";


export default function Home() {
	// 状态管理
	const [posts, setPosts] = useState([]);
	const [projects, setProjects] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	// 获取数据
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// 并行获取博客文章和项目数据
				const [postsResponse, projectsResponse] = await Promise.all([
					fetch('/api/posts').then(res => res.json()),
					fetch('/api/projects').then(res => res.json())
				]);

				setPosts(postsResponse);
				setProjects(projectsResponse);
			} catch (err) {
				console.error('Error fetching data:', err);
				const e = err instanceof Error ? err : new Error(String(err));
				setError(e);
				// 设置默认数据以防止页面崩溃
				setPosts([]);
				setProjects([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// 如果正在加载，显示加载界面
	if (isLoading) {
		return (
			<main className="min-h-screen flex items-center justify-center" role="main" aria-label="主要内容">
				<LoadingSpinner
					variant="creative"
					size="xl"
					text="正在加载精彩内容..."
					showText={true}
				/>
			</main>
		);
	}

	// 如果有错误，显示错误信息
	if (error) {
		return (
			<main className="min-h-screen flex items-center justify-center" role="main" aria-label="主要内容">
				<div className="text-center p-8">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">加载数据时出现问题</h2>
					<p className="text-gray-600 mb-6">请刷新页面重试</p>
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						刷新页面
					</button>
				</div>
			</main>
		);
	}

	return (
		<>
			{/* SEO 结构化数据 */}
			<HomepageStructuredData />

			<main className=" h-screen " role="main" aria-label="主要内容">
				{/* 欢迎区域 - Hero Section */}
				<HeroSection
					height="screen"
					pattern="none"
					className="relative overflow-hidden mobile-safe-area mobile-hero-optimized"
				>
					<DynamicBackground
						variant="gradient"
						intensity="medium"
						mouseFollow={true}
						particles={true}
						className="absolute inset-1"
					/>

					<AnimatedGradient
						variant="aurora"
						speed="normal"
						intensity="subtle"
						className="absolute inset-0"
					/>

					{/* <MouseFollowParticles
						particleCount={15}
						colors={["hsl(var(--accent-blue))", "hsl(var(--accent-purple))", "hsl(var(--accent-pink))"]}
						sizeRange={[2, 4]}
						followStrength={0.03}
						enabled={true}
						className="absolute inset-0"
					/> */}

					<InteractiveElements
						enableEasterEggs={true}
						enableMicroInteractions={true}
						showActivityStatus={true}
						className="absolute inset-0"
					/>

					<div className="relative text-center space-y-20">
						{/* 个性化问候 */}
						<div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
							<div className="mobile-hero-title">
								<PersonalizedGreeting
									typewriter={true}
									typewriterSpeed={100}
									rainbowGradient={false}
									showEmoji={true}
									customGreetings={[
										"欢迎来到 Tiny Room ✨",
										"很高兴遇见你 👋",
										"一起探索有趣的世界 🌍",
										"让创意与技术完美融合 🚀"
									]}
								/>
							</div>

							{/* 副标题 - 打字机效果 */}
							<div className="mobile-hero-subtitle">
								<TypewriterText
									text="祝你早安，午安，晚安。"
									speed={20}
									showCursor={true}
									className="text-base sm:text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed block mobile-text-optimized"
								/>
							</div>
						</div>

					</div>
				</HeroSection>
			</main>
		</>
	);
}
