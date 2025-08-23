import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";

const prisma = new PrismaClient();

// 验证 schema - 与主路由保持一致
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

// 获取单个餐厅信息 (GET)
export async function GET(req: Request, { params }: { params: { id: string } }) {
	try {
		const { id } = params;

		const restaurant = await prisma.restaurant.findUnique({
			where: { id },
		});

		if (!restaurant) {
			return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
		}

		// 转换 Decimal 类型为 number
		const formattedRestaurant = {
			...restaurant,
			rating: restaurant.rating ? Number(restaurant.rating) : undefined,
		};

		return NextResponse.json(formattedRestaurant);
	} catch (error) {
		console.error("Failed to fetch restaurant:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// 更新餐厅 (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { id } = params;
		const body = await req.json();

		// 验证输入数据
		const validation = restaurantApiSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ error: "Invalid input", details: validation.error.flatten() },
				{ status: 400 }
			);
		}

		// 检查餐厅是否存在
		const existingRestaurant = await prisma.restaurant.findUnique({
			where: { id },
		});

		if (!existingRestaurant) {
			return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
		}

		// 检查是否是餐厅创建者或有权限修改
		if (existingRestaurant.authorId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// 处理标签字段
		const { tags, ...restOfData } = validation.data;

		const updatedRestaurant = await prisma.restaurant.update({
			where: { id },
			data: {
				...restOfData,
				tags: tags
					? tags
							.split(",")
							.map(tag => tag.trim())
							.filter(Boolean)
					: [],
			},
		});

		// 转换 Decimal 类型为 number
		const formattedRestaurant = {
			...updatedRestaurant,
			rating: updatedRestaurant.rating ? Number(updatedRestaurant.rating) : undefined,
		};

		return NextResponse.json(formattedRestaurant);
	} catch (error) {
		console.error("Failed to update restaurant:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// 删除餐厅 (DELETE)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { id } = params;

		// 检查餐厅是否存在
		const restaurant = await prisma.restaurant.findUnique({
			where: { id },
		});

		if (!restaurant) {
			return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
		}

		// 检查是否是餐厅创建者或有权限删除
		if (restaurant.authorId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// 删除餐厅
		await prisma.restaurant.delete({
			where: { id },
		});

		return NextResponse.json({
			message: "Restaurant deleted successfully",
			deletedId: id,
		});
	} catch (error) {
		console.error("Failed to delete restaurant:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
