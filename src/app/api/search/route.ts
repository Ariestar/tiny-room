import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";
import { getAllPosts } from "@/lib/posts";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q") || "";

		if (!query || query.length < 2) {
			return NextResponse.json({ results: [] });
		}

		// 获取所有文章
		const posts = await getAllPosts();

		// 创建搜索索引
		const fuse = new Fuse(posts, {
			keys: [
				{ name: "title", weight: 0.7 },
				{ name: "content", weight: 0.2 },
				{ name: "tags", weight: 0.1 },
			],
			threshold: 0.3, // 匹配阈值，越小越严格
			includeScore: true,
			includeMatches: true,
			minMatchCharLength: 2,
		});

		// 执行搜索
		const searchResults = fuse.search(query).slice(0, 10); // 限制返回10个结果

		// 格式化结果
		const results = searchResults.map(result => ({
			slug: result.item.slug,
			title: result.item.title,
			date: result.item.date,
			tags: result.item.tags,
			readingTime: result.item.readingTime,
			score: result.score,
			// 提取匹配的文本片段
			matches: result.matches?.map(match => ({
				key: match.key,
				value: match.value,
				indices: match.indices,
			})),
		}));

		return NextResponse.json({ results, total: results.length });
	} catch (error) {
		console.error("Search API error:", error);
		return NextResponse.json({ error: "搜索服务暂时不可用" }, { status: 500 });
	}
}
