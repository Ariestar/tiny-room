import { NextResponse } from "next/server";
import { githubFetch } from "@/lib/server/github";

export async function GET() {
	try {
		const rate = await githubFetch<{ resources: any }>("/rate_limit");
		return NextResponse.json(rate);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to fetch rate limit";
		const status = message.includes("access token not found") ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
