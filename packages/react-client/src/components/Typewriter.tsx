import { useEffect, useState } from "react";
import type { TerminalContentItem } from "@lib/stores/terminal.store";
import { nextItem } from "@lib/stores/terminal.store";
import { user_store } from "@lib/stores/user.store";
import TerminalLine from "./TerminalLine";

interface TypewriterProps {
	terminalContent: TerminalContentItem | null;
}

export default function Typewriter({ terminalContent }: TypewriterProps) {
	const [displayContent, setDisplayContent] =
		useState<TerminalContentItem | null>(null);
	const minTypingDelay = 2;
	const maxTypingDelay = 9;

	useEffect(() => {
		// Reset display content when terminalContent changes
		setDisplayContent(null);

		if (terminalContent === null) {
			return;
		}

		// Fast mode - instant display
		if (
			terminalContent.useTypewriter === false ||
			user_store.get().typewriter_effect === false
		) {
			nextItem(terminalContent);
			return;
		}

		// Clone the content item for animation
		const newDisplayContent = { ...terminalContent, text: "" };
		setDisplayContent(newDisplayContent);

		let currentIndex = 0;
		const text = terminalContent.text;

		const interval = setInterval(
			() => {
				if (currentIndex >= text.length) {
					clearInterval(interval);
					nextItem(terminalContent);
					return;
				}

				const char = text[currentIndex];
				setDisplayContent((prev) => {
					if (!prev) return prev;
					return { ...prev, text: prev.text + char };
				});
				currentIndex++;
			},
			(terminalContent.speed || 1) *
				Math.random() *
				(maxTypingDelay - minTypingDelay) +
				minTypingDelay,
		);

		// Cleanup interval on unmount or when terminalContent changes
		return () => {
			clearInterval(interval);
		};
	}, [terminalContent]);

	if (displayContent === null) {
		return null;
	}

	return <TerminalLine content={displayContent} />;
}
