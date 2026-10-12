import MarkdownIt from "markdown-it";
const markdown = new MarkdownIt({ html: false, linkify: false, typographer: false });
export function renderMarkdown(body: string): string {
  // Metadata provides the single H1. Editorial body starts at H2.
  const tokens = markdown.parse(body, {});
  if (tokens.some(token => token.type === "heading_open" && token.tag === "h1")) {
    throw new Error("Editorial content must start at H2; the template renders H1.");
  }
  return markdown.renderer.render(tokens, markdown.options, {});
}
