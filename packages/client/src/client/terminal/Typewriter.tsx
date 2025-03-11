import { useEffect, useState } from "react";
import type { TerminalContentItem } from "@lib/stores/terminal.store";
import { nextItem, useTerminalStore } from "@lib/stores/terminal.store";
import { user_store } from "@lib/stores/user.store";
import TerminalLine from "./TerminalLine";


export default function Typewriter() {
	const [displayContent, setDisplayContent] =
		useState<TerminalContentItem | null>(null);
	const minTypingDelay = 2;
	const maxTypingDelay = 9;

	const {currentContentItem} = useTerminalStore();

	useEffect(() => {
		console.warn("Typewriter", currentContentItem);
		// Reset display content when currentContentItem changes
		setDisplayContent(null);

		if (currentContentItem === null) {
			return;
		}

		// Fast mode - instant display
		if (
			currentContentItem.useTypewriter === false ||
			user_store.get().typewriter_effect === false
		) {
			nextItem(currentContentItem);
			return;
		}

		// Clone the content item for animation
		const newDisplayContent = { ...currentContentItem, text: "" };
		setDisplayContent(newDisplayContent);

		let currentIndex = 0;
		const text = currentContentItem.text;

		const interval = setInterval(
			() => {
				if (currentIndex >= text.length) {
					clearInterval(interval);
					console.log("endlength", text.length);
					nextItem(currentContentItem);
					return;
				}

				const char = text[currentIndex];
				setDisplayContent((prev) => {
					if (!prev) return prev;
					return { ...prev, text: prev.text + char };
				});
				currentIndex++;
			},
			(currentContentItem.speed || 1) *
				Math.random() *
				(maxTypingDelay - minTypingDelay) +
				minTypingDelay,
		);

		// Cleanup interval on unmount or when currentContentItem changes
		return () => {
			clearInterval(interval);
		};
	}, [currentContentItem]);

	if (displayContent === null) {
		return null;
	}

	return <TerminalLine content={displayContent} />;
}
