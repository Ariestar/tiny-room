import { ReadingProgress } from "@/components/feature/blog/ReadingProgress";

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ReadingProgress />
            {children}
        </>
    );
}