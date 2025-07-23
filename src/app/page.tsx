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
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";
import { CompatibilityTester } from "@/components/dev/CompatibilityTester";
import { TestingDashboard } from "@/components/dev/TestingDashboard";


// 注意：客户端组件不能导出 metadata，元数据已移至 layout.tsx
export default function Home() {
	// 状态管理
	const [posts, setPosts] = useState([]);
	const [projects, setProjects] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

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
				setError(err);
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
			<ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
				<main className="min-h-screen flex items-center justify-center" role="main" aria-label="主要内容">
					<LoadingSpinner
						variant="creative"
						size="lg"
						text="正在加载精彩内容..."
						showText={true}
					/>
				</main>
			</ErrorBoundary>
		);
	}

	// 如果有错误，显示错误信息
	if (error) {
		return (
			<ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
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
			</ErrorBoundary>
		);
	}

	return (
		<ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
			{/* SEO 结构化数据 */}
			<HomepageStructuredData />

			<main className="min-h-screen" role="main" aria-label="主要内容">
				{/* 欢迎区域 - Hero Section */}
				<HeroSection
					height="lg"
					pattern="none"
					className="relative overflow-hidden mobile-safe-area mobile-hero-optimized"
				>
					{/* 动态背景效果 */}
					<DynamicBackground
						variant="gradient"
						intensity="medium"
						mouseFollow={true}
						particles={false}
						className="absolute inset-1"
					/>

					{/* 动画渐变背景 */}
					<AnimatedGradient
						variant="aurora"
						speed="normal"
						intensity="subtle"
						className="absolute inset-0"
					/>

					{/* 鼠标跟随粒子系统 */}
					<MouseFollowParticles
						particleCount={15}
						colors={["hsl(var(--accent-blue))", "hsl(var(--accent-purple))", "hsl(var(--accent-pink))"]}
						sizeRange={[2, 4]}
						followStrength={0.03}
						enabled={true}
						className="absolute inset-0"
					/>

					{/* 互动元素和彩蛋 */}
					<InteractiveElements
						enableEasterEggs={true}
						enableMicroInteractions={true}
						showActivityStatus={true}
						className="absolute inset-0"
					/>

					<div className="relative z-20 text-center space-y-8">
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
									text="一个有趣且富有个性的个人博客空间，展现创意与技术的完美融合"
									speed={20}
									showCursor={true}
									className="text-base sm:text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed block mobile-text-optimized"
								/>
							</div>
						</div>

						{/* 快速导航按钮 */}
						<ScrollRevealContainer className="flex flex-col sm:flex-row gap-4 justify-center items-center mobile-button-group" role="navigation" aria-label="快速导航">
							<MicroInteraction type="hover-lift" intensity="strong">
								<ScrollRevealItem
									className="touch-target px-6 py-4 sm:py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors cursor-pointer w-full sm:w-auto text-center mobile-button-feedback"
									role="button"
									tabIndex={0}
									aria-label="探索网站内容"
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											// 滚动到内容区域
											document.querySelector('[data-section="content"]')?.scrollIntoView({ behavior: 'smooth' });
										}
									}}
									onClick={() => {
										document.querySelector('[data-section="content"]')?.scrollIntoView({ behavior: 'smooth' });
									}}
								>
									探索内容
								</ScrollRevealItem>
							</MicroInteraction>
							<MicroInteraction type="hover-scale" intensity="strong">
								<ScrollRevealItem
									className="touch-target px-6 py-4 sm:py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors cursor-pointer w-full sm:w-auto text-center mobile-button-feedback"
									role="button"
									tabIndex={0}
									aria-label="了解更多关于作者的信息"
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											// 滚动到关于我区域
											document.querySelector('[data-section="about"]')?.scrollIntoView({ behavior: 'smooth' });
										}
									}}
									onClick={() => {
										document.querySelector('[data-section="about"]')?.scrollIntoView({ behavior: 'smooth' });
									}}
								>
									了解更多
								</ScrollRevealItem>
							</MicroInteraction>
						</ScrollRevealContainer>
					</div>
				</HeroSection>

				{/* 最新博客文章区域 */}
				<ContentSection
					title="最新文章"
					subtitle="Latest Posts"
					description="分享技术见解、学习心得和创意想法"
					variant="default"
					size="lg"
					titleAlign="center"
					divider
					className="mobile-content-section"
					data-section="content"
				>
					<Container size="lg" className="mobile-container">
						<BlogPreview
							posts={posts}
							maxPosts={3}
							className="mb-6 sm:mb-8 mobile-blog-preview"
						/>
					</Container>
				</ContentSection>

				{/* 精选项目区域 */}
				<ContentSection
					title="精选项目"
					subtitle="Featured Projects"
					description="展示技术实力和创新思维的项目作品"
					variant="muted"
					size="lg"
					titleAlign="center"
					divider
					className="mobile-content-section"
				>
					<Container size="lg" className="mobile-container">
						<ProjectShowcase
							projects={projects}
							maxProjects={6}
							showGitHubLink={true}
							className="mb-6 sm:mb-8 mobile-project-grid"
						/>
					</Container>
				</ContentSection>

				{/* 其他内容预览 */}
				<ContentSection
					title="更多内容"
					subtitle="More Content"
					description="发现更多有趣的内容和创作"
					variant="default"
					size="lg"
					titleAlign="center"
					className="mobile-content-section"
				>
					<Container size="lg" className="mobile-container">
						<ScrollRevealContainer
							className="mb-8 sm:mb-12"
							staggerChildren={0.2}
						>
							<ResponsiveGrid
								columns={{ xs: 1, md: 2 }}
								gap="lg"
								className="mobile-grid-single"
							>
								{/* 精美图片预览卡片 - 变形效果 */}
								<ScrollRevealItem>
									<CreativeCard
										variant="morphing"
										size="md"
										enable3D={true}
										enableHover={true}
										gradient="linear-gradient(135deg, hsl(var(--accent-pink))/0.1 0%, hsl(var(--accent-orange))/0.1 100%)"
										className="mobile-card-compact"
									>
										<CardContent
											icon="📸"
											title="精美图片"
											description="记录生活美好瞬间和艺术创作"
											badge="精选"
											action="浏览画廊"
										/>
									</CreativeCard>
								</ScrollRevealItem>

								{/* 学习笔记预览卡片 - 玻璃效果 */}
								<ScrollRevealItem>
									<CreativeCard
										variant="glass"
										size="md"
										enable3D={true}
										enableHover={true}
										className="mobile-card-compact"
									>
										<CardContent
											icon="📚"
											title="学习笔记"
											description="技术学习过程中的心得体会和知识总结"
											badge="持续更新"
											action="查看笔记"
										/>
									</CreativeCard>
								</ScrollRevealItem>
							</ResponsiveGrid>
						</ScrollRevealContainer>
					</Container>
				</ContentSection>

				{/* 个人介绍区域 */}
				<ContentSection
					title="关于我"
					subtitle="About Me"
					description="一个热爱技术与创意的开发者"
					variant="default"
					size="lg"
					titleAlign="center"
					divider
					className="mobile-content-section"
					data-section="about"
				>
					<Container size="xl" className="mobile-container">
						<PersonalIntro className="py-6 sm:py-8" />
					</Container>
				</ContentSection>

				{/* 联系互动区域 */}
				<ContentSection
					title="联系我"
					subtitle="Get In Touch"
					description="欢迎交流技术、分享想法或者只是打个招呼"
					variant="muted"
					size="lg"
					titleAlign="center"
					divider
				>
					<Container size="xl">
						<ScrollRevealContainer className="space-y-12" staggerChildren={0.3}>
							{/* 联系方式详细信息 */}
							<ScrollRevealItem>
								<ContactInfo />
							</ScrollRevealItem>

							{/* 互动游戏和彩蛋 */}
							<ScrollRevealItem>
								<div>
									<h3 className="text-xl font-semibold text-center text-gray-800 mb-8">
										互动体验
									</h3>
									<InteractiveEasterEggs />
								</div>
							</ScrollRevealItem>

							{/* 社交媒体链接 */}
							<ScrollRevealItem>
								<div>
									<h3 className="text-xl font-semibold text-center text-gray-800 mb-8">
										社交媒体
									</h3>
									<SocialLinks
										layout="grid"
										showLabels={true}
										size="md"
										className="max-w-4xl mx-auto"
									/>
								</div>
							</ScrollRevealItem>
						</ScrollRevealContainer>
					</Container>
				</ContentSection>

			</main>

			{/* 开发环境测试工具 */}
			<CompatibilityTester />
			<TestingDashboard />
		</ErrorBoundary>
	);
}
