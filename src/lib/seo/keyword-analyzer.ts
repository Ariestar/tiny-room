// 关键词分析工具
export interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  density: number;
  positions: number[];
  inTitle: boolean;
  inHeadings: boolean;
  inFirstParagraph: boolean;
  inLastParagraph: boolean;
  prominence: number;
}

export interface SEOScore {
  overall: number;
  breakdown: {
    keywordOptimization: number;
    contentStructure: number;
    readability: number;
    technicalSEO: number;
  };
  recommendations: string[];
}

// 停用词列表
const STOP_WORDS = new Set([
  "的",
  "了",
  "在",
  "是",
  "我",
  "有",
  "和",
  "就",
  "不",
  "人",
  "都",
  "一",
  "一个",
  "上",
  "也",
  "很",
  "到",
  "说",
  "要",
  "去",
  "你",
  "会",
  "着",
  "没有",
  "看",
  "好",
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
]);

// 提取文本中的关键词
export function extractKeywords(text: string, minLength: number = 2): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length >= minLength && !STOP_WORDS.has(word) && !/^\d+$/.test(word)
    );
}

// 分析关键词密度和分布
export function analyzeKeywords(
  content: string,
  title: string = "",
  targetKeywords: string[] = []
): KeywordAnalysis[] {
  const fullText = `${title} ${content}`;
  const words = extractKeywords(fullText);
  const totalWords = words.length;

  // 统计词频
  const wordFreq = new Map<string, number>();
  const wordPositions = new Map<string, number[]>();

  words.forEach((word, index) => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);

    if (!wordPositions.has(word)) {
      wordPositions.set(word, []);
    }
    wordPositions.get(word)!.push(index);
  });

  // 获取高频词和目标关键词
  const keywordsToAnalyze = new Set([
    ...targetKeywords.map((k) => k.toLowerCase()),
    ...Array.from(wordFreq.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word),
  ]);

  const analyses: KeywordAnalysis[] = [];

  keywordsToAnalyze.forEach((keyword) => {
    const frequency = wordFreq.get(keyword) || 0;
    const positions = wordPositions.get(keyword) || [];
    const density = totalWords > 0 ? (frequency / totalWords) * 100 : 0;

    // 检查关键词位置
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();
    const paragraphs = content.split(/\n\s*\n/);
    const headings = content.match(/#{1,6}\s+.+/g) || [];

    const inTitle = titleLower.includes(keyword);
    const inHeadings = headings.some((h) => h.toLowerCase().includes(keyword));
    const inFirstParagraph =
      paragraphs.length > 0 && paragraphs[0].toLowerCase().includes(keyword);
    const inLastParagraph =
      paragraphs.length > 0 &&
      paragraphs[paragraphs.length - 1].toLowerCase().includes(keyword);

    // 计算关键词突出度
    let prominence = 0;
    if (inTitle) prominence += 3;
    if (inHeadings) prominence += 2;
    if (inFirstParagraph) prominence += 1.5;
    if (inLastParagraph) prominence += 1;
    if (density > 1 && density < 3) prominence += 1;

    analyses.push({
      keyword,
      frequency,
      density,
      positions,
      inTitle,
      inHeadings,
      inFirstParagraph,
      inLastParagraph,
      prominence,
    });
  });

  return analyses.sort((a, b) => b.prominence - a.prominence);
}

// 计算内容可读性分数
export function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = extractKeywords(content, 1);
  const syllables = words.reduce(
    (total, word) => total + countSyllables(word),
    0
  );

  if (sentences.length === 0 || words.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // 简化的可读性公式
  const score =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  return Math.max(0, Math.min(100, score));
}

// 计算音节数（简化版）
function countSyllables(word: string): number {
  // 中文字符每个字算一个音节
  const chineseChars = word.match(/[\u4e00-\u9fff]/g);
  if (chineseChars) {
    return chineseChars.length;
  }

  // 英文单词音节计算
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  const vowels = word.match(/[aeiouy]+/g);
  let syllableCount = vowels ? vowels.length : 1;

  if (word.endsWith("e")) syllableCount--;
  if (word.endsWith("le") && word.length > 2) syllableCount++;

  return Math.max(1, syllableCount);
}

// 分析内容结构
export function analyzeContentStructure(content: string): {
  headingCount: number;
  paragraphCount: number;
  listCount: number;
  linkCount: number;
  imageCount: number;
  wordCount: number;
  avgParagraphLength: number;
  hasIntroduction: boolean;
  hasConclusion: boolean;
} {
  const headings = content.match(/#{1,6}\s+.+/g) || [];
  const paragraphs = content
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0);
  const lists = content.match(/^[\s]*[-*+]\s+.+$/gm) || [];
  const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  const images = content.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || [];
  const words = extractKeywords(content, 1);

  const avgParagraphLength =
    paragraphs.length > 0
      ? paragraphs.reduce((sum, p) => sum + extractKeywords(p, 1).length, 0) /
        paragraphs.length
      : 0;

  // 检查是否有引言和结论
  const firstParagraph = paragraphs[0] || "";
  const lastParagraph = paragraphs[paragraphs.length - 1] || "";

  const introKeywords = [
    "介绍",
    "概述",
    "本文",
    "今天",
    "首先",
    "introduction",
    "overview",
    "today",
  ];
  const conclusionKeywords = [
    "总结",
    "结论",
    "最后",
    "综上",
    "conclusion",
    "summary",
    "finally",
    "in conclusion",
  ];

  const hasIntroduction = introKeywords.some((keyword) =>
    firstParagraph.toLowerCase().includes(keyword)
  );

  const hasConclusion = conclusionKeywords.some((keyword) =>
    lastParagraph.toLowerCase().includes(keyword)
  );

  return {
    headingCount: headings.length,
    paragraphCount: paragraphs.length,
    listCount: lists.length,
    linkCount: links.length,
    imageCount: images.length,
    wordCount: words.length,
    avgParagraphLength,
    hasIntroduction,
    hasConclusion,
  };
}

// 生成SEO评分和建议
export function generateSEOScore(
  content: string,
  title: string,
  description: string,
  targetKeywords: string[] = []
): SEOScore {
  const keywordAnalysis = analyzeKeywords(content, title, targetKeywords);
  const contentStructure = analyzeContentStructure(content);
  const readabilityScore = calculateReadabilityScore(content);

  // 关键词优化评分
  let keywordScore = 0;
  if (targetKeywords.length > 0) {
    const targetAnalysis = keywordAnalysis.filter((k) =>
      targetKeywords.some((tk) => tk.toLowerCase() === k.keyword)
    );

    targetAnalysis.forEach((analysis) => {
      if (analysis.inTitle) keywordScore += 25;
      if (analysis.inHeadings) keywordScore += 15;
      if (analysis.density > 0.5 && analysis.density < 3) keywordScore += 20;
      if (analysis.inFirstParagraph) keywordScore += 10;
    });

    keywordScore = Math.min(100, keywordScore);
  } else {
    keywordScore = 50; // 没有目标关键词时的默认分数
  }

  // 内容结构评分
  let structureScore = 0;
  if (contentStructure.headingCount > 0) structureScore += 20;
  if (contentStructure.paragraphCount >= 3) structureScore += 15;
  if (contentStructure.avgParagraphLength < 100) structureScore += 15;
  if (contentStructure.hasIntroduction) structureScore += 10;
  if (contentStructure.hasConclusion) structureScore += 10;
  if (contentStructure.listCount > 0) structureScore += 10;
  if (contentStructure.linkCount > 0) structureScore += 10;
  if (contentStructure.wordCount >= 300) structureScore += 10;

  // 技术SEO评分
  let technicalScore = 0;
  if (title.length >= 30 && title.length <= 60) technicalScore += 25;
  if (description.length >= 120 && description.length <= 160)
    technicalScore += 25;
  if (contentStructure.imageCount > 0) technicalScore += 25;
  if (contentStructure.linkCount > 0) technicalScore += 25;

  // 综合评分
  const overall = Math.round(
    keywordScore * 0.3 +
      structureScore * 0.3 +
      readabilityScore * 0.2 +
      technicalScore * 0.2
  );

  // 生成建议
  const recommendations: string[] = [];

  if (keywordScore < 70) {
    recommendations.push("在标题和正文中更好地使用目标关键词");
  }
  if (structureScore < 70) {
    recommendations.push("改善内容结构，添加标题、段落和列表");
  }
  if (readabilityScore < 60) {
    recommendations.push("简化句子结构，提高内容可读性");
  }
  if (technicalScore < 70) {
    recommendations.push("优化标题和描述长度，添加图片和链接");
  }
  if (contentStructure.wordCount < 300) {
    recommendations.push("增加内容长度，至少300字以上");
  }
  if (!contentStructure.hasIntroduction) {
    recommendations.push("添加引言段落，介绍文章主题");
  }
  if (!contentStructure.hasConclusion) {
    recommendations.push("添加结论段落，总结文章要点");
  }

  return {
    overall,
    breakdown: {
      keywordOptimization: keywordScore,
      contentStructure: structureScore,
      readability: readabilityScore,
      technicalSEO: technicalScore,
    },
    recommendations,
  };
}

// 生成长尾关键词建议
export function generateLongTailKeywords(
  content: string,
  baseKeywords: string[]
): string[] {
  const words = extractKeywords(content);
  const longTailKeywords: string[] = [];

  // 基于基础关键词生成长尾关键词
  baseKeywords.forEach((baseKeyword) => {
    const baseWords = baseKeyword.toLowerCase().split(/\s+/);

    // 查找包含基础关键词的短语
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = words.slice(i, i + 3).join(" ");
      if (baseWords.some((word) => phrase.includes(word))) {
        longTailKeywords.push(phrase);
      }
    }
  });

  // 基于高频词组合生成长尾关键词
  const wordFreq = new Map<string, number>();
  words.forEach((word) => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  const topWords = Array.from(wordFreq.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);

  // 生成词组合
  for (let i = 0; i < topWords.length; i++) {
    for (let j = i + 1; j < topWords.length; j++) {
      longTailKeywords.push(`${topWords[i]} ${topWords[j]}`);
    }
  }

  // 去重并返回前20个
  return Array.from(new Set(longTailKeywords)).slice(0, 20);
}
