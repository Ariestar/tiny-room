import { Lora } from "next/font/google";
import localFont from "next/font/local";

export const lora = Lora({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-lora",
});

export const lxgwWenkai = localFont({
	src: [
		{
			path: "../assets/fonts/LXGWWenKai-Regular.ttf",
			weight: "400",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-lxgw-wenkai",
});
