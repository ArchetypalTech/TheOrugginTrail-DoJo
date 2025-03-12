import { cn } from "@/lib/utils/utils";
import { useState } from "react";
import type { KeyboardEvent, FocusEvent } from "react";

interface TagInputProps {
	value: string[];
	onChange: (tags: string[]) => void;
	className?: string;
}

export const TagInput = ({ value, onChange, className }: TagInputProps) => {
	const [input, setInput] = useState("");

	// Handles keyboard events and blur to add new tags
	const handleInputEvent = (
		event: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>,
	) => {
		// Check if conditions are met to add a tag
		if (
			event.type !== "blur" &&
			(event as KeyboardEvent<HTMLInputElement>).key !== " " &&
			(event as KeyboardEvent<HTMLInputElement>).key !== "," &&
			(event as KeyboardEvent<HTMLInputElement>).key !== "Enter"
		) {
			return;
		}

		// Clean the remaining comma in input
		const cleanedInput = input.replace(",", "").trim();

		// Don't add if empty or already exists
		if (
			cleanedInput === "" ||
			cleanedInput.match(/^\s*$/) ||
			value.includes(cleanedInput)
		) {
			setInput("");
			return;
		}

		// Add the new tag
		const newTags = [...value, cleanedInput];
		onChange(newTags);
		setInput("");
	};

	// Removes a tag at the specified index
	const handleRemoveTag = (idx: number) => {
		const newTags = [...value];
		newTags.splice(idx, 1);
		onChange(newTags);
	};

	return (
		<>
			<input
				list="tag_suggestion"
				onBlur={handleInputEvent}
				onKeyUp={handleInputEvent}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className={cn(
					"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
				)}
			/>
			<div className="flex flex-wrap mt-2">
				{value.map((tag, index) => {
					if (tag === "") return null;
					return (
						<span
							key={index}
							className="tag inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
						>
							{tag}{" "}
							<a
								href="#del"
								className="tag-handler ml-2 text-black no-underline"
								onClick={(e) => {
									e.preventDefault();
									handleRemoveTag(index);
								}}
							>
								⨉
							</a>
						</span>
					);
				})}
			</div>
		</>
	);
};
