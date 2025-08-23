import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";

const prisma = new PrismaClient();

const restaurantApiSchema = z.object({
	name: z.string().min(2, "名称至少需要2个字符"),
	category: z.string().min(2, "分类至少需要2个字符"),
	address: z.string().min(5, "地址至少需要5个字符"),
	coordinates: z.array(z.number()).length(2, "坐标必须是包含经纬度的数组"),
	rating: z.coerce.number().min(0).max(5).optional(),
	priceRange: z.string().optional(),
	description: z.string().optional(),
	tags: z.string().optional(),
	phone: z.string().optional(),
	openingHours: z.string().optional(),
	website: z.string().url("请输入有效的网址").optional().or(z.literal("")),
});

export async function GET() {
	try {
		const restaurantsFromDb = await prisma.restaurant.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});

		// Prisma returns Decimal types for Float, so we need to ensure they are numbers
		const restaurants = restaurantsFromDb.map(r => ({
			...r,
			rating: r.rating ? Number(r.rating) : undefined,
			// The coordinates are now directly from the DB as a Float[] which is compatible with number[]
		}));

		return NextResponse.json(restaurants);
	} catch (error) {
		console.error("Failed to fetch restaurants:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await req.json();
		console.log("Received body:", body);

		const validation = restaurantApiSchema.safeParse(body);

		if (!validation.success) {
			console.log("Validation failed:", validation.error);
			return NextResponse.json(
				{ error: "Invalid input", details: validation.error.flatten() },
				{ status: 400 }
			);
		}

		const { tags, ...restOfData } = validation.data;
		console.log("Validated data:", validation.data);
		console.log("Session user ID:", session.user.id);

		// 调试：打印坐标数据
		console.log("📡 API接收坐标:", {
			coordinates: restOfData.coordinates,
			coordinatesType: typeof restOfData.coordinates,
			coordinatesLength: restOfData.coordinates.length,
			coordinates0: restOfData.coordinates[0],
			coordinates1: restOfData.coordinates[1],
			coordinates0Type: typeof restOfData.coordinates[0],
			coordinates1Type: typeof restOfData.coordinates[1],
		});

		// 检查用户是否存在于数据库中
		console.log("Looking for user with ID:", session.user.id);
		console.log("Session user object:", JSON.stringify(session.user, null, 2));

		const userExists = await prisma.user.findUnique({
			where: { id: session.user.id! },
		});

		if (!userExists) {
			console.error("User not found in database:", session.user.id);
			// 尝试列出数据库中的所有用户（仅用于调试）
			try {
				const allUsers = await prisma.user.findMany({
					select: { id: true, name: true, email: true },
				});
				console.log("All users in database:", allUsers);
			} catch (error) {
				console.error("Failed to list users:", error);
			}
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const newRestaurant = await prisma.restaurant.create({
			data: {
				...restOfData,
				tags: tags
					? tags
							.split(",")
							.map(tag => tag.trim())
							.filter(Boolean)
					: [],
				authorId: session.user.id!,
			},
		});

		// 调试：打印数据库存储的坐标
		console.log("💾 数据库存储坐标:", {
			coordinates: newRestaurant.coordinates,
			coordinatesType: typeof newRestaurant.coordinates,
			coordinatesLength: newRestaurant.coordinates.length,
			coordinates0: newRestaurant.coordinates[0],
			coordinates1: newRestaurant.coordinates[1],
			coordinates0Type: typeof newRestaurant.coordinates[0],
			coordinates1Type: typeof newRestaurant.coordinates[1],
		});

		// 转换 Decimal 类型为 number，与 GET 方法保持一致
		const formattedRestaurant = {
			...newRestaurant,
			rating: newRestaurant.rating ? Number(newRestaurant.rating) : undefined,
		};

		return NextResponse.json(formattedRestaurant, { status: 201 });
	} catch (error) {
		console.error("Failed to create restaurant:", error);
		console.error("Error details:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
