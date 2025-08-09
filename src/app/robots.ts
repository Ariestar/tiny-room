import { MetadataRoute } from "next";
import { generateRobotsTxt } from "@/lib/seo/seo";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/admin/", "/api/", "/_next/", "/private/"],
		},
		sitemap: process.env.NEXT_PUBLIC_SITE_URL + "/sitemap.xml",
	};
}
