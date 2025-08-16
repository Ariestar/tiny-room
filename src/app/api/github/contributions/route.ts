import { NextResponse } from "next/server";
import { getServerGitHubAccessToken } from "@/lib/server/github";

// GitHub GraphQL API endpoint
const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

// GraphQL query to get contribution calendar data (same as GitHub's contribution graph)
const CONTRIBUTIONS_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      login
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`;

async function fetchGraphQL(query: string, variables: any, token: string) {
	const response = await fetch(GITHUB_GRAPHQL_API, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			"User-Agent": "TinyRoom-Dashboard",
		},
		body: JSON.stringify({
			query,
			variables,
		}),
		cache: "no-store",
		next: { revalidate: 0 },
	});

	if (!response.ok) {
		const text = await response.text().catch(() => "");
		throw new Error(
			`GitHub GraphQL API error ${response.status}: ${text || response.statusText}`
		);
	}

	const data = await response.json();

	if (data.errors) {
		throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
	}

	return data;
}

export async function GET() {
	try {
		const token = await getServerGitHubAccessToken();

		// 获取用户信息
		const userResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${token}`,
				"User-Agent": "TinyRoom-Dashboard",
			},
		});

		if (!userResponse.ok) {
			throw new Error("Failed to fetch user info");
		}

		const user = await userResponse.json();
		const login = user.login;

		// 设置时间范围：过去一年
		const to = new Date();
		const from = new Date();
		from.setFullYear(from.getFullYear() - 1);

		// 使用GitHub GraphQL API获取贡献日历数据
		// 这个API返回的数据与GitHub页面上的贡献图完全一致，包括私有仓库的贡献
		const graphqlData = await fetchGraphQL(
			CONTRIBUTIONS_QUERY,
			{
				login,
				from: from.toISOString(),
				to: to.toISOString(),
			},
			token
		);

		const contributionCalendar =
			graphqlData.data?.user?.contributionsCollection?.contributionCalendar;

		if (!contributionCalendar) {
			throw new Error("Failed to fetch contribution calendar data");
		}

		// 转换数据格式以适配热力图组件
		const contributions: Array<{ date: string; count: number }> = [];

		contributionCalendar.weeks.forEach((week: any) => {
			week.contributionDays.forEach((day: any) => {
				contributions.push({
					date: day.date,
					count: day.contributionCount,
				});
			});
		});

		// 计算统计信息
		const totalContributions = contributionCalendar.totalContributions;
		const activeDays = contributions.filter(day => day.count > 0).length;

		return NextResponse.json({
			user: login,
			contributions,
			totalContributions,
			activeDays,
			// 添加调试信息
			dataSource: "GitHub GraphQL API",
			includesPrivateRepos: true,
			timeRange: {
				from: from.toISOString().split("T")[0],
				to: to.toISOString().split("T")[0],
			},
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to fetch contributions";
		const status = message.includes("access token not found") ? 401 : 500;

		console.error("GitHub contributions API error:", error);

		return NextResponse.json(
			{
				error: message,
				details: error instanceof Error ? error.stack : undefined,
			},
			{ status }
		);
	}
}
