import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const title = searchParams.get("title") || "Tiny Room";
		const tags = searchParams.get("tags") || "";
		const type = searchParams.get("type") || "default"; // article, homepage, project, etc.
		const description = searchParams.get("description") || "";

		// 解析标签
		const tagList = tags ? tags.split(",").slice(0, 3) : [];

		// 根据类型选择不同的样式
		const getBackgroundGradient = () => {
			switch (type) {
				case "article":
					return "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";
				case "homepage":
					return "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)";
				case "project":
					return "linear-gradient(135deg, #064e3b 0%, #065f46 100%)";
				default:
					return "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";
			}
		};

		const getAccentColor = () => {
			switch (type) {
				case "article":
					return "#3b82f6";
				case "homepage":
					return "#8b5cf6";
				case "project":
					return "#10b981";
				default:
					return "#3b82f6";
			}
		};

		const accentColor = getAccentColor();

		return new ImageResponse(
			(
				<div
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#0f172a",
						backgroundImage: getBackgroundGradient(),
						fontFamily: "system-ui, -apple-system, sans-serif",
					}}
				>
					{/* 背景装饰 */}
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background:
								"radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
						}}
					/>

					{/* 主要内容 */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							padding: "80px",
							textAlign: "center",
							maxWidth: "900px",
						}}
					>
						{/* 网站标识 */}
						<div
							style={{
								fontSize: "32px",
								fontWeight: "600",
								color: "#64748b",
								marginBottom: "40px",
								display: "flex",
								alignItems: "center",
								gap: "12px",
							}}
						>
							<div
								style={{
									width: "40px",
									height: "40px",
									borderRadius: "8px",
									background: `linear-gradient(135deg, ${accentColor}, #8b5cf6)`,
								}}
							/>
							Tiny Room
						</div>

						{/* 文章标题 */}
						<h1
							style={{
								fontSize: title.length > 50 ? "48px" : "64px",
								fontWeight: "800",
								color: "#f8fafc",
								lineHeight: "1.2",
								marginBottom: "32px",
								textAlign: "center",
							}}
						>
							{title}
						</h1>

						{/* 标签 */}
						{tagList.length > 0 && (
							<div
								style={{
									display: "flex",
									gap: "16px",
									flexWrap: "wrap",
									justifyContent: "center",
								}}
							>
								{tagList.map((tag, index) => (
									<div
										key={index}
										style={{
											padding: "8px 20px",
											backgroundColor: `${accentColor}20`,
											border: `1px solid ${accentColor}50`,
											borderRadius: "20px",
											color: "#93c5fd",
											fontSize: "20px",
											fontWeight: "500",
										}}
									>
										{tag.trim()}
									</div>
								))}
							</div>
						)}

						{/* 描述文本（如果提供） */}
						{description && (
							<p
								style={{
									fontSize: "18px",
									color: "#94a3b8",
									marginTop: "24px",
									maxWidth: "600px",
									lineHeight: "1.5",
								}}
							>
								{description.slice(0, 120)}
								{description.length > 120 ? "..." : ""}
							</p>
						)}
					</div>

					{/* 底部装饰 */}
					<div
						style={{
							position: "absolute",
							bottom: "40px",
							right: "40px",
							fontSize: "18px",
							color: "#64748b",
							fontWeight: "500",
						}}
					>
						tinyroom.dev
					</div>
				</div>
			),
			{
				width: 1200,
				height: 630,
			}
		);
	} catch (error) {
		console.error("Error generating OG image:", error);
		return new Response("Failed to generate image", { status: 500 });
	}
}
