import localFont from "next/font/local";

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
