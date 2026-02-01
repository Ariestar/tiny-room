import Badge from "@/components/ui/Badge";
import { SocialShare } from "@/components/feature/blog/SocialShare";

interface ArticleMetadataProps {
	date?: string;
	modified?: string;
	readingTime: number;
	tags: string[];
	viewCount?: number;
	className?: string;
	// 分享相关属性
	url?: string;
	title?: string;
	description?: string;
	showShare?: boolean;
}

export function ArticleMetadata({
	date,
	modified,
	readingTime,
	tags,
	viewCount,
	className = "",
	url,
	title,
	description,
	showShare = false,
}: ArticleMetadataProps) {
	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('zh-CN');
		} catch (e) {
			return dateString;
		}
	};

	return (
		<div className={className}>
			{/* 桌面端布局：左右分布 */}
			<div className="hidden sm:flex items-center justify-between gap-6">
				{/* 左侧：文章元数据 */}
				<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
					<div className='flex items-center gap-1.5' title="发布时间">
						<span className='text-base'>📅</span>
						<span>{date ? formatDate(date) : "草稿"}</span>
					</div>

					{modified && modified !== date && (
						<div className='flex items-center gap-1.5 text-gray-500' title="最后修改">
							<span className='text-base'>📝</span>
							<span>{formatDate(modified)}</span>
						</div>
					)}

					<div className='flex items-center gap-1.5'>
						<span className='text-base'>⏱️</span>
						<span>{readingTime} min</span>
					</div>

					{viewCount !== undefined && (
						<div className='flex items-center gap-1.5'>
							<span className='text-base'>👁️</span>
							<span>{viewCount.toLocaleString()}</span>
						</div>
					)}

					{tags.length > 0 && (
						<div className='flex items-center gap-2'>
							<span className='text-base'>🏷️</span>
							<div className='flex flex-wrap gap-1'>
								{tags.map(tag => (
									<Badge key={tag} variant='secondary' className='text-xs'>
										{tag}
									</Badge>
								))}
							</div>
						</div>
					)}
				</div>

				{/* 右侧：社交分享 */}
				{showShare && url && title && (
					<div className="flex-shrink-0">
						<SocialShare
							variant="minimal"
							size="sm"
							url={url}
							title={title}
							description={description}
							hashtags={tags}
							showLabels={false}
						/>
					</div>
				)}
			</div>

			{/* 移动端布局：垂直堆叠 */}
			<div className="sm:hidden space-y-4">
				{/* 文章元数据 */}
				<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 justify-center">
					<div className='flex items-center gap-1'>
						<span className='text-base'>📅</span>
						<span>{date ? formatDate(date) : "草稿"}</span>
					</div>

					{modified && modified !== date && (
						<div className='flex items-center gap-1 text-gray-500'>
							<span className='text-base'>📝</span>
							<span>{formatDate(modified)}</span>
						</div>
					)}

					<div className='flex items-center gap-1'>
						<span className='text-base'>⏱️</span>
						<span>{readingTime} min</span>
					</div>

					{viewCount !== undefined && (
						<div className='flex items-center gap-1'>
							<span className='text-base'>👁️</span>
							<span>{viewCount.toLocaleString()}</span>
						</div>
					)}

					{/* 标签 */}
					{tags.length > 0 && (
						<div className='flex items-center justify-center gap-2'>
							<span className='text-base text-gray-600 dark:text-gray-400'>🏷️</span>
							<div className='flex flex-wrap gap-1 justify-center'>
								{tags.map(tag => (
									<Badge key={tag} variant='secondary' className='text-xs'>
										{tag}
									</Badge>
								))}
							</div>
						</div>
					)}
				</div>

			</div>
		</div >
	);
}