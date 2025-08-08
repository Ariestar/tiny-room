import { baseSEOConfig } from '@/lib/seo/seo';

interface CanonicalURLProps {
    path?: string;
    fullURL?: string;
}

export function CanonicalURL({ path, fullURL }: CanonicalURLProps) {
    const canonicalURL = fullURL || `${baseSEOConfig.siteUrl}${path || ''}`;

    return (
        <link
            rel="canonical"
            href={canonicalURL}
        />
    );
}

// 博客文章的canonical URL组件
export function BlogCanonicalURL({ slug }: { slug: string }) {
    return <CanonicalURL path={`/blog/${slug}`} />;
}

// 分页页面的canonical URL组件
export function PaginatedCanonicalURL({
    basePath,
    page
}: {
    basePath: string;
    page: number;
}) {
    const path = page === 1 ? basePath : `${basePath}?page=${page}`;
    return <CanonicalURL path={path} />;
}