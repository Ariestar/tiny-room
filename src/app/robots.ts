import { MetadataRoute } from "next";
import { generateRobotsTxt } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/_next/", "/private/"],
    },
    sitemap: "https://tinyroom.dev/sitemap.xml",
  };
}
