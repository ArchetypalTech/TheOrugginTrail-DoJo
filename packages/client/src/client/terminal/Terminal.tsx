import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
	useTerminalStore,
	addTerminalContent,
	nextItem,
} from "@lib/stores/terminal.store";
import DojoStore, { useDojoStore } from "@lib/stores/dojo.store";
import Typewriter from "./Typewriter";
import TerminalLine from "./TerminalLine";
import "./Terminal.css";
import { commandHandler } from "../../lib/terminalCommands/commandHandler";
import { ORUG_CONFIG } from "@/lib/config";
import WalletStore from "@/lib/stores/wallet.store";

export default function Terminal() {
	const [inputValue, setInputValue] = useState("");
	const [originalInputValue, setOriginalInputValue] = useState("");
	const [inputHistory, setInputHistory] = useState<string[]>([]);
	const [inputHistoryIndex, setInputHistoryIndex] = useState(0);

	const terminalFormRef = useRef<HTMLFormElement>(null);
	const terminalInputRef = useRef<HTMLInputElement>(null);

	const {
		status: { status, error },
	} = useDojoStore();
	const { terminalContent, currentContentItem } = useTerminalStore();

	useEffect(() => {
		// Focus input on mount
		if (terminalInputRef.current) {
			terminalInputRef.current.focus();
		}
		// Set timeout for connection status
		const timeout = setTimeout(() => {
			if (status !== "spawning") {
				DojoStore().setStatus({
					status: "error",
					error: "TIMEOUT",
				});
			}
		}, 5000);

		return () => clearTimeout(timeout);
	}, [status]);

	useEffect(() => {
		if (status === "spawning") return;
		if (status === "initialized") {
			addTerminalContent({
				text: [
					"\n",
					"The O'Ruggin Trail, no:23",
					"from the good folk at",
					"\n",
					"Archetypal Tech ✯",
					"\n\n\n\n\n\n\n\n\n\n",
				].join("\n"),
				format: "system",
				useTypewriter: true,
				speed: 4,
				style: { textAlign: "center" },
			});
			if (ORUG_CONFIG.useSlot) {
				if (!WalletStore().isConnected) {
					addTerminalContent({
						text: "type [wallet] to connect.",
						format: "hash",
						useTypewriter: true,
					});
				}
			}

			addTerminalContent({
				text: 'type [command] [target], or type "help"',
				format: "input",
				useTypewriter: true,
			});

			DojoStore().setStatus({
				status: "spawning",
				error: null,
			});

			return;
		}

		if (status === "error") {
			addTerminalContent({
				text: `FATAL+ERROR: ${error}`,
				format: "error",
				useTypewriter: false,
			});

			// TODO: implement interval check to ping backend
			return;
		}
	}, [status, error]);

	// Split handleKeyDown to reduce complexity
	const handleUpArrow = (e: KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (inputHistoryIndex === 0) {
			setOriginalInputValue(inputValue);
		}
		if (inputHistoryIndex < inputHistory.length) {
			setInputHistoryIndex(inputHistoryIndex + 1);
			setInputValue(inputHistory[inputHistory.length - inputHistoryIndex - 1]);
		}
	};

	const handleDownArrow = (e: KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (inputHistoryIndex > 0) {
			setInputHistoryIndex(inputHistoryIndex - 1);
			if (inputHistoryIndex === 1) {
				setInputValue(originalInputValue);
			} else {
				setInputValue(inputHistory[inputHistory.length - inputHistoryIndex + 1]);
			}
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case "ArrowUp":
				handleUpArrow(e);
				break;
			case "ArrowDown":
				handleDownArrow(e);
				break;
			case "Escape":
				e.preventDefault();
				nextItem(currentContentItem);
				break;
			default:
				break;
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (terminalInputRef.current) {
			terminalInputRef.current.disabled = true;
		}
		e.preventDefault();
		const command = inputValue;
		setInputHistoryIndex(0);

		if (command === "") return;

		setInputValue("");
		setInputHistory([...inputHistory, command]);

		await commandHandler(command);

		if (terminalInputRef.current) {
			terminalInputRef.current.disabled = false;
			terminalInputRef.current.focus();
		}
	};

	const focusInput = () => {
		if (terminalInputRef.current) {
			terminalInputRef.current.focus();
		}
	};

	return (
		<div className="flex items-center justify-center w-full h-full crt">
			<form
				ref={terminalFormRef}
				onSubmit={handleSubmit}
				onClick={focusInput}
				onKeyDown={focusInput}
				aria-label="Terminal"
				role=""
				id="terminal"
				className="font-mono overflow-y-auto h-full bg-black text-green-500 border rounded-md p-4 w-full"
				style={{
					borderColor:
						status === "error" ? "var(--terminal-error)" : "var(--terminal-system)",
				}}
			>
				<div id="scroller" className="flex items-end flex-col bottom-0 w-full">
					{terminalContent.map((content, index) => (
						<TerminalLine key={index} content={content} />
					))}

					<Typewriter />

					{status === "spawning" && (
						<div id="scroller" className="w-full flex flex-row gap-2">
							<span>&#x3e;</span>
							<input
								className="bg-transparent terminal-line system w-full"
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								ref={terminalInputRef}
								onKeyDown={handleKeyDown}
								style={{ outline: "none" }}
							/>
							<div
								id="input-anchor"
								style={{ overflowAnchor: "auto", height: "1px" }}
							/>
						</div>
					)}
				</div>
			</form>
		</div>
	);
}
