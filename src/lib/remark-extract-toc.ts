import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "mdast";
import { toString } from "mdast-util-to-string";

export interface TocEntry {
	title: string;
	url: string;
	depth: number;
}

export const remarkExtractToc: Plugin<[], Root> = () => {
	return (tree, file) => {
		const toc: TocEntry[] = [];
		visit(tree, "heading", node => {
			if (node.depth > 1 && node.depth < 5) {
				// We only care about h2, h3, h4
				const title = toString(node);
				const id = (node.data?.hProperties as { id?: string })?.id;

				if (id) {
					toc.push({
						title,
						url: "#" + id,
						depth: node.depth,
					});
				}
			}
		});

		// Add the extracted toc to the file's data
		file.data.toc = toc;
	};
};
