/**
 * Determines the entity ID from an array of keys. If only one key is provided,
 * it's directly used as the entity ID. Otherwise, a poseidon hash of the keys is calculated.
 *
 * @param {bigint[]} keys - An array of big integer keys.
 * @returns {any} The determined entity ID.
 */
export function getEntityIdFromKeys(keys: string | number): string {
	// FIXME: this returns a constant string - and does not actually generate entity id from keys
	console.warn(
		"FIXME: this returns a constant string - and does not actually generate entity id from keys",
	);
	// needs to use an iterator but for now we just use the one key value
	const big = BigInt(keys);

	// if (keys.length === 1) {
	//     return ("0x" + keys[0].toString(16)) as Entity;
	// }
	// calculate the poseidon hash of the keys
	// return ("0x" + poseidon.toString(16)) as any;
	return "0xffb67209646c1b2a78ee5b917b31c7013eaf46b9c2432215118c5bd79e18de";
}

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
	console.log(args);
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
					return [item.length, ...item.flat()];
				}
				return item;
			}),
		];
		result.push(...arr);
	}
	console.log(result);
	return result;
};
