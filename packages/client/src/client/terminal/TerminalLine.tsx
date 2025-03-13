import { cn } from "../../lib/utils/utils";
import type { TerminalContentItem } from "@lib/stores/terminal.store";
import "./Terminal.css";

interface TerminalLineProps {
	content: TerminalContentItem | null;
}

export default function TerminalLine({ content }: TerminalLineProps) {
	if (content === null) {
		return null;
	}

	// Parse the text with newlines and tabs for safe rendering
	const contentText = content.text
		.replace(/\n/g, "<br>")
		.replace(/\t/g, "&emsp;");

	const { format } = content;

	return (
		<div
			className={cn(
				`terminal-line w-full`,
				format !== "input" && "textFreak",
				format === "shog" && "shog",
				format === "out" && "out",
				format === "system" && "system",
				format === "error" && "error",
				format === "hash" && "hash",
				format === "input" && "input",
			)}
			style={content.style || {}}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <Using dangerouslySetInnerHTML is necessary here for the newline formatting>
			dangerouslySetInnerHTML={{
				__html: contentText,
			}}
		/>
	);
}
