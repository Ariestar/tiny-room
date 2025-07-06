import Button from "@/components/ui/Button";
import Link from "next/link";
import { techStack } from "@/lib/data";
import { Component, Sparkles, Type } from "lucide-react";

export default function Home() {
	return (
		<main>
			{/* Hero Section */}
			<div className='relative overflow-hidden bg-background'>
				<div className='container mx-auto px-6 py-24 sm:py-32 md:py-40 relative z-10'>
					<div className='text-center'>
						<h1 className='text-6xl font-extrabold tracking-tighter text-foreground mb-6 font-display animate-slide-up'>
							Tiny Room
						</h1>
						<p
							className='text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up'
							style={{ animationDelay: "0.2s" }}
						>
							一个集展示、管理、分析于一体的现代个人网站。
						</p>

						<div
							className='flex justify-center mt-8 space-x-4 animate-slide-up'
							style={{ animationDelay: "0.4s" }}
						>
							<Button variant='primary' size='lg' asChild>
								<Link href='/dashboard'>开始使用</Link>
							</Button>
							<Button variant='secondary' size='lg' asChild>
								<Link href='https://github.com'>GitHub</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>

			<FeaturesSection />
			<TechStackSection />
		</main>
	);
}

function FeaturesSection() {
	return (
		<section className='py-24 bg-card'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-16'>
					<h2 className='text-4xl font-bold text-foreground mb-4 font-display'>
						设计系统
					</h2>
					<p className='text-lg text-muted-foreground'>
						我们的设计系统基于最新的技术和最佳实践
					</p>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					<div className='bg-card rounded-3xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 animate-card-hover cursor-pointer border border-border'>
						<div className='w-12 h-12 bg-primary rounded-2xl mb-4 flex items-center justify-center'>
							<Component className='w-6 h-6 text-primary-foreground' />
						</div>
						<h3 className='text-xl font-semibold mb-2 text-foreground'>原子化组件</h3>
						<p className='text-muted-foreground'>
							基于 shadcn/ui 构建，可组合、可定制。
						</p>
					</div>

					<div className='bg-card rounded-3xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 animate-card-hover cursor-pointer border border-border'>
						<div className='w-12 h-12 bg-accent-purple rounded-2xl mb-4 flex items-center justify-center'>
							<Sparkles className='w-6 h-6 text-white' />
						</div>
						<h3 className='text-xl font-semibold mb-2 text-foreground'>优雅的动画</h3>
						<p className='text-muted-foreground'>
							由 Framer Motion 驱动，带来流畅的交互体验。
						</p>
					</div>

					<div className='bg-card rounded-3xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 animate-card-hover cursor-pointer border border-border'>
						<div className='w-12 h-12 bg-accent-pink rounded-2xl mb-4 flex items-center justify-center'>
							<Type className='w-6 h-6 text-white' />
						</div>
						<h3 className='text-xl font-semibold mb-2 text-foreground'>精美的排版</h3>
						<p className='text-muted-foreground'>
							优化了中英文的阅读体验，视觉效果出众。
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function TechStackSection() {
	return (
		<section className='py-24 bg-background'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-16'>
					<h2 className='text-4xl font-bold text-foreground mb-4 font-display'>技术栈</h2>
					<p className='text-lg text-muted-foreground'>生产级代码，企业级标准</p>
				</div>
				<div className='max-w-4xl mx-auto'>
					<ul className='grid grid-cols-2 md:grid-cols-4 gap-8'>
						{techStack.map((tech: any) => (
							<li key={tech.name} className='flex items-center space-x-4'>
								<div className='text-4xl'>{tech.icon}</div>
								<div>
									<h3 className='font-semibold text-foreground'>{tech.name}</h3>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
