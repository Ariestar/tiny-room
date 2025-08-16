import { NextResponse } from "next/server";
import { fetchCurrentUser } from "@/lib/server/github";

export async function GET() {
	try {
		const user = await fetchCurrentUser();
		return NextResponse.json(user);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to fetch GitHub user";
		const status = message.includes("access token not found") ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}



