import localFont from "next/font/local";

const lxgwWenkai = localFont({
	src: "../../assets/fonts/LXGWWenKai-Regular.ttf",
	display: "swap",
	variable: "--font-lxgw-wenkai",
});

const bookerly = localFont({
	src: "../../assets/fonts/Bookerly.ttf",
	display: "swap",
	variable: "--font-bookerly",
});

export const fonts = {
	lxgwWenkai,
	bookerly,
};
