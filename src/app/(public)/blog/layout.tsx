import React from "react";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<ScrollToTopButton className="bottom-8 left-8" emoji="↑" />
		</>
	);
}
