import { byteArray } from "starknet";

const convertIfString = (item: unknown) => {
	if ((item as TempInt).name === "TempInt") {
		if ((item as TempInt).value === "") {
			return 0;
		}
		return parseInt((item as TempInt).value);
	}
	if ((item as ByteArray).name === "ByteArray") {
		if ((item as ByteArray).value === "") {
			return 0;
		}
		return byteArray.byteArrayFromString((item as ByteArray).value);
	}
	if (item === "") {
		return 0;
	}
	// check if string is NOT all numbers
	if (typeof item === "string" && !/^[0-9]+$/.test(item) && item !== "") {
		return byteArray.byteArrayFromString(item);
	}
	return item;
};
/**
 * Converts a JavaScript array to a Cairo array format.
 *
 * Cairo arrays are represented as [length, item1, item2, ...].
 * Empty arrays are represented as [0].
 *
 * For Cairo object arrays in the format [[var,var,var,[],var,var],[var,var,var,[],var,var]],
 * we need special handling:
 * - When we have an array, we start with the length then items
 * - When we have a Cairo object, we flatten it
 * - When we have an array in a Cairo object, we use the array format [length, item, item, item]
 *
 * Examples:
 * // Simple array
 * toCairoArray([1, 2, 3]) // returns [3, 1, 2, 3]
 *
 * // Empty array
 * toCairoArray([]) // returns [0]
 *
 * // Nested arrays
 * toCairoArray([1, [2, 3], 4]) // returns [3, 1, 2, 2, 3, 4]
 * toCairoArray([[1, 2], [3, 4]]) // returns [2, 2, 1, 2, 2, 3, 4]
 *
 * // Cairo object array
 * toCairoArray([
 *   [288709, 1, 0, 3, 6, [], 0],
 *   [791662, 1, 0, 3, 6, [], 0]
 * ]) // returns [2, 288709, 1, 0, 3, 6, 0, 0, 791662, 1, 0, 3, 6, 0, 0]
 */

export const toCairoArray = (args: unknown[]): unknown[] => {
	// console.dir(args, 8);
	if (args.length === 0) {
		return [0]; // Empty array is represented as [0] in Cairo
	}

	const result: unknown[] = [args.length];

	for (const arg of args) {
		const arr = [
			...(arg as unknown[]).map((item: unknown) => {
				if (Array.isArray(item)) {
					if (item.length === 0) {
						return 0;
					}
					return [...item.flatMap(convertIfString)];
				}
				return convertIfString(item);
			}),
		];
		result.push(...arr);
	}
	// console.dir(result, 8);
	return result;
};

export class TempInt {
	name = "TempInt";
	value: string;
	constructor(value: string) {
		this.value = value;
	}
}

export class ByteArray {
	name = "ByteArray";
	value: string;
	constructor(value: string) {
		this.value = value;
	}
}
