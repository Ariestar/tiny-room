import { NextRequest, NextResponse } from "next/server";

interface AmapSearchResult {
  id: string;
  name: string;
  address: string;
  location: string; // "116.397428,39.90923"
  tel: string;
  type: string;
  typecode: string;
  distance: string;
  business_area: string;
  citycode: string;
  adcode: string;
  pname: string;
  cityname: string;
  adname: string;
  tag: string;
  photos?: Array<{
    title: string;
    url: string;
  }>;
  biz_ext?: {
    rating?: string;
    cost?: string;
    open_time?: string;
    tag?: string;
  };
}

interface AmapSearchResponse {
  status: string;
  count: string;
  info: string;
  infocode: string;
  pois: AmapSearchResult[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");
  const city = searchParams.get("city");
  const location = searchParams.get("location"); // 格式: "lng,lat"
  const radius = searchParams.get("radius") || "5000"; // 默认搜索半径5km
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "10";

  console.log("搜索参数:", { keyword, city, location, radius, page, pageSize });

  if (!keyword) {
    return NextResponse.json({ error: "搜索关键词不能为空" }, { status: 400 });
  }

  // 检查API密钥
  const apiKey = process.env.NEXT_PUBLIC_AMAP_SEARCH_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "地图服务配置错误" }, { status: 500 });
  }

  try {
    // 构建高德地图POI搜索API请求
    const amapUrl = new URL("https://restapi.amap.com/v3/place/text");
    amapUrl.searchParams.set("key", apiKey);
    amapUrl.searchParams.set("keywords", keyword);

    // 优先使用位置坐标搜索，其次使用城市名称，最后默认全国搜索
    if (location) {
      // 基于坐标的周边搜索
      amapUrl.searchParams.set("location", location);
      amapUrl.searchParams.set("radius", radius);
      amapUrl.searchParams.set("sortrule", "distance"); // 按距离排序
    } else if (city) {
      // 基于城市的搜索
      amapUrl.searchParams.set("city", city);
    }
    // 如果都没有，则进行全国搜索（不设置city和location参数）

    amapUrl.searchParams.set("page", page);
    amapUrl.searchParams.set("offset", pageSize);
    amapUrl.searchParams.set("extensions", "all"); // 返回详细信息，包括营业时间等
    amapUrl.searchParams.set("output", "json");

    console.log("调用高德地图API:", amapUrl.toString());
    const response = await fetch(amapUrl.toString());

    const data: AmapSearchResponse = await response.json();
    console.log("高德地图API响应:", {
      status: data.status,
      count: data.count,
      poisLength: data.pois?.length,
    });

    if (data.status !== "1") {
      console.error("高德地图API返回错误:", data.info, data.infocode);

      // 处理其他错误码
      let errorMessage = "搜索失败";
      switch (data.infocode) {
        case "10003":
          errorMessage = "API密钥权限不足";
          break;
        case "10009":
          errorMessage = "API密钥平台配置不匹配";
          break;
        case "10010":
          errorMessage = "请求超出配额";
          break;
        default:
          errorMessage = `搜索失败: ${data.info}`;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: data.info,
          code: data.infocode,
        },
        { status: 500 }
      );
    }

    // 处理搜索结果 - 添加错误处理
    const results = data.pois
      .map((poi) => {
        try {
          // 安全解析坐标
          const locationStr = poi.location || "";
          const [lng, lat] = locationStr.split(",").map(Number);

          // 验证坐标有效性
          if (isNaN(lng) || isNaN(lat)) {
            console.warn(
              `Invalid coordinates for POI ${poi.id}: ${poi.location}`
            );
            return null; // 跳过无效坐标的POI
          }

          // 验证必要字段
          if (!poi.name?.toString().trim() || !poi.address?.toString().trim()) {
            console.warn(`Missing required fields for POI ${poi.id}`);
            return null; // 跳过缺少必要信息的POI
          }

          // 解析标签 - 安全处理不同类型的tag数据
          const tags =
            poi.tag && typeof poi.tag === "string"
              ? poi.tag.split(";").filter((tag) => tag.trim())
              : [];

          // 解析营业时间
          const businessHours = poi.biz_ext?.open_time || "营业时间未知";

          // 解析评分和价格
          const rating = poi.biz_ext?.rating || "暂无评分";
          const priceRange = poi.biz_ext?.cost || "价格未知";

          return {
            id:
              poi.id ||
              `poi_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: poi.name?.toString() || "未知名称",
            address: poi.address?.toString() || "地址未知",
            coordinates: [lng, lat] as [number, number],
            phone: poi.tel?.toString() || "电话未提供",
            type: poi.type?.toString() || "未知类型",
            distance: poi.distance?.toString() || "0",
            businessHours,
            tags,
            rating,
            priceRange,
            businessArea: poi.business_area || "",
            cityName: poi.cityname || "",
            adName: poi.adname || "",
          };
        } catch (error) {
          console.error(`Error processing POI:`, poi, error);
          return null; // 跳过处理失败的POI
        }
      })
      .filter((poi) => poi !== null); // 过滤掉null值

    return NextResponse.json({
      success: true,
      count: parseInt(data.count),
      results,
    });
  } catch (error) {
    console.error("高德地图搜索API调用失败:", error);

    return NextResponse.json(
      {
        success: false,
        error: "搜索服务暂时不可用，请稍后重试",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
