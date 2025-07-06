"use client";
import React from "react";
import { motion } from "framer-motion";
import Card, { CardHeader, CardContent, CardTitle } from "@/components/ui/Card";

const AnimationsPage = () => {
	return (
		<div className='container mx-auto px-4 py-8 space-y-12'>
			<div className='text-center'>
				<h1 className='text-4xl font-bold'>Animations</h1>
				<p className='text-muted-foreground mt-2'>
					Showcase of animations using Framer Motion.
				</p>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Page Load Animations</CardTitle>
				</CardHeader>
				<CardContent className='grid md:grid-cols-2 gap-8'>
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className='w-full h-32 bg-secondary rounded-lg flex items-center justify-center'
					>
						<span className='text-secondary-foreground'>Fade In Left</span>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className='w-full h-32 bg-secondary rounded-lg flex items-center justify-center'
					>
						<span className='text-secondary-foreground'>Slide Up</span>
					</motion.div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Hover & Tap Animations</CardTitle>
				</CardHeader>
				<CardContent className='grid md:grid-cols-2 gap-8'>
					<motion.div
						whileHover={{ scale: 1.05, rotate: 2 }}
						whileTap={{ scale: 0.95, rotate: -2 }}
						className='w-full h-32 bg-secondary rounded-lg flex items-center justify-center'
					>
						<span className='text-secondary-foreground'>Hover or Tap Me</span>
					</motion.div>
					<motion.div
						whileHover={{ y: -10 }}
						transition={{ type: "spring", stiffness: 300 }}
						className='w-full h-32 bg-secondary rounded-lg flex items-center justify-center'
					>
						<span className='text-secondary-foreground'>Hover Me (Spring)</span>
					</motion.div>
				</CardContent>
			</Card>
		</div>
	);
};

export default AnimationsPage;
