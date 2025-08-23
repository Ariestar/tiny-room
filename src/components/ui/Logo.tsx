import Link from "next/link";
import { cn } from "@/lib/shared/utils";

export const Logo = ({ showText }: { showText: boolean }) => {
    return (
        <Link href="/" className="font-medium font-bevan text-lg group flex items-center space-x-2">
            <span className={cn(showText ? 'block' : 'hidden')}>Tiny Room</span>
        </Link>
    );
}