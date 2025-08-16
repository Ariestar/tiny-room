import { NextRequest, NextResponse } from "next/server";
import { fetchUserRepos } from "@/lib/server/github";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		// allow passthrough of type, sort, direction, per_page, page
		const params = new URLSearchParams();
		const allow = ["type", "sort", "direction", "per_page", "page"] as const;
		allow.forEach(k => {
			const v = searchParams.get(k);
			if (v !== null) params.set(k, v);
		});

		if (!params.has("type")) params.set("type", "all"); // 默认获取所有仓库（包括 private）
		if (!params.has("per_page")) params.set("per_page", "100");
		if (!params.has("sort")) params.set("sort", "updated");
		if (!params.has("direction")) params.set("direction", "desc");

		const repos = await fetchUserRepos(params);
		return NextResponse.json(repos);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to fetch GitHub repos";
		const status = message.includes("access token not found") ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
