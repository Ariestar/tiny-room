import { NextResponse } from "next/server";
import { fetchUserRepos, computeProjectStats } from "@/lib/server/github";

export async function GET() {
	try {
		const params = new URLSearchParams({
			type: "all", // 获取所有仓库（包括 private）
			per_page: "100",
			sort: "updated",
			direction: "desc",
		});
		const repos = await fetchUserRepos(params);
		const stats = await computeProjectStats(repos);
		return NextResponse.json(stats);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to compute project stats";
		const status = message.includes("access token not found") ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
