import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Element } from "hast";
import { toString } from "hast-util-to-string";

export interface TocEntry {
	title: string;
	url: string;
	depth: number;
}

export const rehypeExtractToc: Plugin<[], Root> = () => {
	return (tree, file) => {
		const toc: TocEntry[] = [];
		visit(tree, "element", (node: Element) => {
			if (
				node.tagName &&
				["h2", "h3", "h4", "h5", "h6"].includes(node.tagName) &&
				node.properties?.id
			) {
				toc.push({
					title: toString(node),
					url: "#" + node.properties.id,
					depth: Number(node.tagName.charAt(1)),
				});
			}
		});

		file.data.toc = toc;
	};
};
