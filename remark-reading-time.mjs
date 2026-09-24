import { toString as mdToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export function remarkReadingTime() {
	let done = false;
	return {
		name: "reading-time",
		text(_node, ctx) {
			if (done) return;
			done = true;

			let root = _node;
			let parent = ctx.parent(root);
			while (parent) {
				root = parent;
				parent = ctx.parent(root);
			}

			const textOnPage = mdToString(root);
			const readingTime = getReadingTime(textOnPage);

			const frontmatter = ctx.data.astro?.frontmatter;
			if (frontmatter) {
				frontmatter.minutesRead = readingTime.text;
			}
		},
	};
}
