import { computePoseidonHashOnElements } from "starknet";
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
	const poseidon = computePoseidonHashOnElements([big]);
	// return ("0x" + poseidon.toString(16)) as any;
	return "0xffb67209646c1b2a78ee5b917b31c7013eaf46b9c2432215118c5bd79e18de";
}
