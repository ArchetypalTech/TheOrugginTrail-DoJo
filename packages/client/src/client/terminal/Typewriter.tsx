import { useEffect, useState } from "react";
import type { TerminalContentItem } from "@lib/stores/terminal.store";
import { nextItem, useTerminalStore } from "@lib/stores/terminal.store";
import UserStore from "@lib/stores/user.store";
import TerminalLine from "./TerminalLine";

export default function Typewriter() {
	const [displayContent, setDisplayContent] =
		useState<TerminalContentItem | null>(null);
	const minTypingDelay = 2;
	const maxTypingDelay = 9;

	const { activeTypewriterLine } = useTerminalStore();

	useEffect(() => {
		// Reset display content when activeTypewriterLine changes
		setDisplayContent(null);

		if (activeTypewriterLine === null) {
			return;
		}

		// Fast mode - instant display
		if (
			activeTypewriterLine.useTypewriter === false ||
			UserStore().typewriter_effect === false
		) {
			nextItem(activeTypewriterLine);
			return;
		}

		// Clone the content item for animation
		const newDisplayContent = { ...activeTypewriterLine, text: "" };
		setDisplayContent(newDisplayContent);

		let currentIndex = 0;
		const text = activeTypewriterLine.text;

		const interval = setInterval(
			() => {
				if (currentIndex >= text.length) {
					clearInterval(interval);
					nextItem(activeTypewriterLine);
					return;
				}

				const char = text[currentIndex];
				setDisplayContent((prev) => {
					if (!prev) return prev;
					return { ...prev, text: prev.text + char };
				});
				currentIndex++;
			},
			(activeTypewriterLine.speed || 1) *
				Math.random() *
				(maxTypingDelay - minTypingDelay) +
				minTypingDelay,
		);

		// Cleanup interval on unmount or when activeTypewriterLine changes
		return () => {
			clearInterval(interval);
		};
	}, [activeTypewriterLine]);

	if (displayContent === null) {
		return null;
	}

	return <TerminalLine content={displayContent} />;
}
