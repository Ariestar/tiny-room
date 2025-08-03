// 文章推荐算法
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  tags: string[];
  date: string;
  readingTime?: number;
  views?: number;
  likes?: number;
  shares?: number;
  category?: string;
}

export interface RecommendationScore {
  postId: string;
  score: number;
  reasons: string[];
}

export interface RecommendationOptions {
  maxResults?: number;
  includePopular?: boolean;
  includeFresh?: boolean;
  includeRelated?: boolean;
  userTags?: string[];
  currentPostId?: string;
  timeDecayFactor?: number;
  popularityWeight?: number;
  freshnessWeight?: number;
  relevanceWeight?: number;
}

// 计算文章新鲜度评分 (0-1)
export function calculateFreshnessScore(
  publishDate: string,
  decayFactor: number = 0.1
): number {
  const now = new Date();
  const postDate = new Date(publishDate);
  const daysDiff = Math.floor(
    (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 使用指数衰减函数
  return Math.exp((-decayFactor * daysDiff) / 30); // 30天为基准
}

// 计算文章热度评分 (0-1)
export function calculatePopularityScore(post: Post): number {
  const views = post.views || 0;
  const likes = post.likes || 0;
  const shares = post.shares || 0;

  // 加权计算热度，分享权重最高
  const rawScore = views * 0.1 + likes * 2 + shares * 5;

  // 使用对数函数平滑化，避免极值
  return Math.min(1, Math.log(rawScore + 1) / Math.log(1000));
}

// 计算标签相关性评分 (0-1)
export function calculateRelevanceScore(
  postTags: string[],
  userTags: string[] = [],
  currentPostTags: string[] = []
): number {
  const allReferenceTags = [...userTags, ...currentPostTags];
  if (allReferenceTags.length === 0) return 0;

  const intersection = postTags.filter((tag) =>
    allReferenceTags.some(
      (refTag) =>
        refTag.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(refTag.toLowerCase())
    )
  );

  return (
    intersection.length / Math.max(postTags.length, allReferenceTags.length)
  );
}

// 计算内容相似度评分 (0-1)
export function calculateContentSimilarity(
  content1: string,
  content2: string
): number {
  // 简单的词频相似度计算
  const words1 = content1.toLowerCase().match(/\w+/g) || [];
  const words2 = content2.toLowerCase().match(/\w+/g) || [];

  const freq1 = new Map<string, number>();
  const freq2 = new Map<string, number>();

  words1.forEach((word) => freq1.set(word, (freq1.get(word) || 0) + 1));
  words2.forEach((word) => freq2.set(word, (freq2.get(word) || 0) + 1));

  const allWords = new Set([...words1, ...words2]);
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  allWords.forEach((word) => {
    const f1 = freq1.get(word) || 0;
    const f2 = freq2.get(word) || 0;
    dotProduct += f1 * f2;
    norm1 += f1 * f1;
    norm2 += f2 * f2;
  });

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// 智能文章推荐算法
export function getSmartRecommendations(
  posts: Post[],
  options: RecommendationOptions = {}
): RecommendationScore[] {
  const {
    maxResults = 6,
    includePopular = true,
    includeFresh = true,
    includeRelated = true,
    userTags = [],
    currentPostId,
    timeDecayFactor = 0.1,
    popularityWeight = 0.3,
    freshnessWeight = 0.3,
    relevanceWeight = 0.4,
  } = options;

  // 过滤掉当前文章
  const candidatePosts = posts.filter((post) => post.id !== currentPostId);

  // 获取当前文章的标签（如果有）
  const currentPost = currentPostId
    ? posts.find((p) => p.id === currentPostId)
    : null;
  const currentPostTags = currentPost?.tags || [];

  const recommendations: RecommendationScore[] = candidatePosts.map((post) => {
    const reasons: string[] = [];
    let score = 0;

    // 新鲜度评分
    if (includeFresh) {
      const freshnessScore = calculateFreshnessScore(
        post.date,
        timeDecayFactor
      );
      score += freshnessScore * freshnessWeight;
      if (freshnessScore > 0.7) reasons.push("最新发布");
    }

    // 热度评分
    if (includePopular) {
      const popularityScore = calculatePopularityScore(post);
      score += popularityScore * popularityWeight;
      if (popularityScore > 0.6) reasons.push("热门文章");
    }

    // 相关性评分
    if (includeRelated) {
      const relevanceScore = calculateRelevanceScore(
        post.tags,
        userTags,
        currentPostTags
      );
      score += relevanceScore * relevanceWeight;
      if (relevanceScore > 0.3) reasons.push("相关内容");
    }

    // 内容相似度加分（如果有当前文章）
    if (currentPost) {
      const similarityScore = calculateContentSimilarity(
        post.content,
        currentPost.content
      );
      score += similarityScore * 0.2; // 较小权重
      if (similarityScore > 0.3) reasons.push("相似主题");
    }

    // 标签匹配加分
    const tagMatches = post.tags.filter((tag) =>
      [...userTags, ...currentPostTags].some(
        (refTag) => refTag.toLowerCase() === tag.toLowerCase()
      )
    );
    if (tagMatches.length > 0) {
      score += tagMatches.length * 0.1;
      reasons.push(`${tagMatches.join(", ")} 相关`);
    }

    // 阅读时间适中的文章加分
    if (post.readingTime && post.readingTime >= 3 && post.readingTime <= 15) {
      score += 0.1;
      reasons.push("适中篇幅");
    }

    return {
      postId: post.id,
      score: Math.min(1, score), // 限制最高分为1
      reasons: reasons.slice(0, 3), // 最多显示3个原因
    };
  });

  // 按评分排序并返回指定数量
  return recommendations.sort((a, b) => b.score - a.score).slice(0, maxResults);
}

// 获取热门文章
export function getPopularPosts(posts: Post[], limit: number = 5): Post[] {
  return posts
    .sort((a, b) => calculatePopularityScore(b) - calculatePopularityScore(a))
    .slice(0, limit);
}

// 获取最新文章
export function getLatestPosts(posts: Post[], limit: number = 5): Post[] {
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// 获取相关文章
export function getRelatedPosts(
  posts: Post[],
  targetPost: Post,
  limit: number = 5
): Post[] {
  const relatedScores = posts
    .filter((post) => post.id !== targetPost.id)
    .map((post) => ({
      post,
      score:
        calculateRelevanceScore(post.tags, [], targetPost.tags) +
        calculateContentSimilarity(post.content, targetPost.content) * 0.5,
    }))
    .sort((a, b) => b.score - a.score);

  return relatedScores.slice(0, limit).map((item) => item.post);
}

// 基于用户行为的个性化推荐
export function getPersonalizedRecommendations(
  posts: Post[],
  userPreferences: {
    viewedPosts: string[];
    likedTags: string[];
    preferredReadingTime?: number;
    preferredCategories?: string[];
  },
  limit: number = 6
): Post[] {
  const { viewedPosts, likedTags, preferredReadingTime, preferredCategories } =
    userPreferences;

  const recommendations = posts
    .filter((post) => !viewedPosts.includes(post.id))
    .map((post) => {
      let score = 0;

      // 标签偏好匹配
      const tagScore = calculateRelevanceScore(post.tags, likedTags);
      score += tagScore * 0.4;

      // 阅读时间偏好
      if (preferredReadingTime && post.readingTime) {
        const timeDiff = Math.abs(post.readingTime - preferredReadingTime);
        const timeScore = Math.max(0, 1 - timeDiff / 20); // 20分钟为最大差异
        score += timeScore * 0.2;
      }

      // 分类偏好
      if (preferredCategories && post.category) {
        const categoryScore = preferredCategories.includes(post.category)
          ? 1
          : 0;
        score += categoryScore * 0.3;
      }

      // 新鲜度
      const freshnessScore = calculateFreshnessScore(post.date);
      score += freshnessScore * 0.1;

      return { post, score };
    })
    .sort((a, b) => b.score - a.score);

  return recommendations.slice(0, limit).map((item) => item.post);
}

// 多样化推荐 - 确保推荐结果的多样性
export function diversifyRecommendations(
  posts: Post[],
  limit: number = 6
): Post[] {
  if (posts.length <= limit) return posts;

  const selected: Post[] = [];
  const remaining = [...posts];
  const usedTags = new Set<string>();
  const usedCategories = new Set<string>();

  // 首先选择评分最高的
  selected.push(remaining.shift()!);
  usedTags.add(...selected[0].tags);
  if (selected[0].category) usedCategories.add(selected[0].category);

  while (selected.length < limit && remaining.length > 0) {
    // 寻找与已选文章差异最大的文章
    let bestIndex = 0;
    let bestDiversityScore = -1;

    remaining.forEach((post, index) => {
      // 计算多样性评分
      const newTags = post.tags.filter((tag) => !usedTags.has(tag));
      const newCategory = post.category && !usedCategories.has(post.category);

      const diversityScore = newTags.length * 0.7 + (newCategory ? 0.3 : 0);

      if (diversityScore > bestDiversityScore) {
        bestDiversityScore = diversityScore;
        bestIndex = index;
      }
    });

    const selectedPost = remaining.splice(bestIndex, 1)[0];
    selected.push(selectedPost);
    usedTags.add(...selectedPost.tags);
    if (selectedPost.category) usedCategories.add(selectedPost.category);
  }

  return selected;
}
