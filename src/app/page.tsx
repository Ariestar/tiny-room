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
import { getSortedPostsData } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { motion } from "framer-motion";

export default function Home() {
	// 获取最新的博客文章数据
	const posts = getSortedPostsData();

	// 获取项目数据
	const allProjects = getAllProjects();

	return (
		<main className="min-h-screen">
			{/* 欢迎区域 - Hero Section */}
			<HeroSection
				height="lg"
				pattern="none"
				className="relative overflow-hidden"
			>
				{/* 动态背景效果 */}
				<DynamicBackground
					variant="gradient"
					intensity="medium"
					mouseFollow={true}
					particles={false}
					className="absolute inset-0"
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
					<div className="space-y-6">
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

						{/* 副标题 - 打字机效果 */}
						<div>
							<TypewriterText
								text="一个有趣且富有个性的个人博客空间，展现创意与技术的完美融合"
								speed={20}
								showCursor={true}
								className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed block"
							/>
						</div>
					</div>

					{/* 快速导航按钮 */}
					<ScrollRevealContainer className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<MicroInteraction type="hover-lift" intensity="strong">
							<ScrollRevealItem className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors cursor-pointer">
								探索内容
							</ScrollRevealItem>
						</MicroInteraction>
						<MicroInteraction type="hover-scale" intensity="strong">
							<ScrollRevealItem className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors cursor-pointer">
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
			>
				<Container size="lg">
					<BlogPreview
						posts={posts}
						maxPosts={3}
						className="mb-8"
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
			>
				<Container size="lg">
					<ProjectShowcase
						projects={allProjects}
						maxProjects={6}
						showGitHubLink={true}
						className="mb-8"
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
			>
				<ScrollRevealContainer
					className="mb-12"
					staggerChildren={0.2}
				>
					<ResponsiveGrid
						columns={{ xs: 1, md: 2 }}
						gap="lg"
					>
						{/* 精美图片预览卡片 - 变形效果 */}
						<ScrollRevealItem>
							<CreativeCard
								variant="morphing"
								size="md"
								enable3D={true}
								enableHover={true}
								gradient="linear-gradient(135deg, hsl(var(--accent-pink))/0.1 0%, hsl(var(--accent-orange))/0.1 100%)"
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
			>
				<Container size="xl">
					<PersonalIntro className="py-8" />
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
	);
}
