// Starknet.js
import { ORUG_CONFIG } from "$lib/config";
import { Contract, RpcProvider } from "starknet";

// Initialize provider with Sepolia Testnet node
// Sepolia: https://starknet-sepolia.public.blastapi.io
export const provider = new RpcProvider({
	nodeUrl: ORUG_CONFIG.token.provider,
});
export const providerSepolia = new RpcProvider({
	nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});

export const addrContract = ORUG_CONFIG.token.contract_address;

// Contract address for the TOT NFT Token in Sepolia
export const addrContractSepolia =
	"0x02cf8f08f551ecb5b839726396d8c8600843078a30b2e288784980cb098ccb7b";

// Async function to initialize contracts
export async function initializeContracts() {
	try {
		// The contract ABI from Katana/Slot
		const { abi: contractAbi } = await provider.getClassAt(addrContract);
		if (!contractAbi) {
			throw new Error("No ABI found for Katana contract");
		}

		// The contract ABI from Sepolia
		const { abi: contractAbiSepolia } =
			await providerSepolia.getClassAt(addrContractSepolia);
		if (!contractAbiSepolia) {
			throw new Error("No ABI found for Sepolia contract");
		}

		// Connect to the contract Katana/Slot
		const totNFTContract = new Contract(contractAbi, addrContract, provider);

		// Connect to the contract Sepolia
		const totNFTContractSepolia = new Contract(
			contractAbiSepolia,
			addrContractSepolia,
			providerSepolia,
		);

		console.log("Contracts initialized successfully!");

		return { totNFTContract, totNFTContractSepolia };
	} catch (error) {
		console.error("Error initializing contracts:", error);
		throw error; // Propagate the error to be handled where the function is called
	}
}
