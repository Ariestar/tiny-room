"use client";
import React from "react";
import { AnimatedDiv, FadeIn, SlideUp } from "@/components/ui";

const AnimationsPage = () => {
	return (
		<div className='p-8 space-y-12'>
			<h1 className='text-4xl font-bold'>Animations Showcase</h1>

			<section>
				<h2 className='text-2xl font-semibold mb-4'>Fade In</h2>
				<FadeIn>
					<AnimatedDiv className='w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center'>
						<p>This div fades in on view</p>
					</AnimatedDiv>
				</FadeIn>
			</section>

			<section>
				<h2 className='text-2xl font-semibold mb-4'>Slide Up</h2>
				<SlideUp>
					<AnimatedDiv className='w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center'>
						<p>This div slides up on view</p>
					</AnimatedDiv>
				</SlideUp>
			</section>
		</div>
	);
};

export default AnimationsPage;
