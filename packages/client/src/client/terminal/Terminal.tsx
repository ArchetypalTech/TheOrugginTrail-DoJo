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
import { sendCommand } from "@lib/terminalCommands/commandHandler";
import { ZORG_CONFIG } from "@/lib/config";
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
	const { terminalContent, activeTypewriterLine } = useTerminalStore();

	useEffect(() => {
		// Focus input on mount
		if (terminalInputRef.current) {
			terminalInputRef.current.focus();
		}
		// Set timeout for connection status
		const timeout = setTimeout(() => {
			if (status !== "inputEnabled") {
				DojoStore().setStatus({
					status: "error",
					error: "TIMEOUT",
				});
			}
		}, 5000);

		return () => clearTimeout(timeout);
	}, [status]);

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
				nextItem(activeTypewriterLine);
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

		await sendCommand(command);

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
		<div className="flex items-center justify-center w-full h-full crt buzzing font-berkeley">
			<form
				ref={terminalFormRef}
				onSubmit={handleSubmit}
				onClick={focusInput}
				onKeyDown={focusInput}
				aria-label="Terminal"
				role=""
				id="terminal"
				className="buzzing overflow-y-auto h-full bg-black text-green-500 border rounded-md p-4 w-full"
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

					{status === "inputEnabled" && (
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
