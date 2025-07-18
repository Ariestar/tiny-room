import Badge from "@/components/ui/Badge";

interface ArticleMetadataProps {
	date: string;
	readingTime: string;
	tags: string[];
	viewCount?: number;
	className?: string;
}

export function ArticleMetadata({
	date,
	readingTime,
	tags,
	viewCount,
	className = "",
}: ArticleMetadataProps) {
	return (
		<div
			className={`flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ${className}`}
		>
			<div className='flex items-center gap-1'>
				<span className='text-base'>📅</span>
				<time dateTime={date}>
					{new Date(date).toLocaleDateString("zh-CN", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</time>
			</div>

			<div className='flex items-center gap-1'>
				<span className='text-base'>⏱️</span>
				<span>{readingTime}</span>
			</div>

			{viewCount !== undefined && (
				<div className='flex items-center gap-1'>
					<span className='text-base'>👁️</span>
					<span>{viewCount.toLocaleString()} 次浏览</span>
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
	);
}
