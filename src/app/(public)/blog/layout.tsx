import "@/styles/prose.css";
import { lora, lxgwWenkai } from "@/lib/fonts";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
	return <div className={`${lora.variable} ${lxgwWenkai.variable}`}>{children}</div>;
}
