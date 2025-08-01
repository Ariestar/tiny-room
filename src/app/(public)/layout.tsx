"use client"; // Required for Framer Motion hooks

import { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ParallaxBackground } from "@/components/animation/ParallaxBackground";
import { useScroll, useSpring } from "framer-motion";

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    // No longer need a ref for the container

    // useScroll now defaults to window scroll
    const { scrollYProgress } = useScroll();

    // Apply a spring effect for smoother parallax
    const smoothScrollYProgress = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 40,
        restDelta: 0.001
    });

    return (
        <div className="relative">
            {/* The background is now fixed to the viewport and will react to window scroll */}
            <ParallaxBackground scrollYProgress={smoothScrollYProgress} />
            {children}
        </div>
    );
}
