// Starknet.js
import { RpcProvider, Contract, Account, ec, json } from "starknet";

// Initialize provider with Sepolia Testnet node
// Sepolia: https://starknet-sepolia.public.blastapi.io
export const provider = new RpcProvider({
	nodeUrl: "https://api.cartridge.gg/x/theoruggintrail/katana",
});
export const providerSepolia = new RpcProvider({
	nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});

// starkli chain-id --rpc https://api.cartridge.gg/x/theoruggintrail/katana
export const oruggin_ChainID = "0x57505f5448454f52554747494e545241494c";

// starkli chain-id --rpc https://api.cartridge.gg/x/theoruggintrailv2/katana
//export const oruggin_ChainID = "0x57505f5448454f52554747494e545241494c5632"

// Contract address for the TOT NFT Token in Katana/Slot
export const addrContract =
	"0x050ab7cbc80f8c7ee18f859dcc81e7ae4213e08da243851a8889d48c2ed7f765";
//export const addrContract = "0x073e84f7c8a69177a1643af77c801eabc4203a7076ea15999fbc1ae5eae9253d";

// Contract address for the TOT NFT Token in Sepolia
export const addrContractSepolia =
	"0x02cf8f08f551ecb5b839726396d8c8600843078a30b2e288784980cb098ccb7b";

// // The contract ABI from Katana/Slot
// const { abi: contractAbi } = await provider.getClassAt(addrContract);
// if (contractAbi === undefined) {
//   throw new Error('no abi.');
// }

// // The contract ABI from Sepolia
// const { abi: contractAbiSepolia } = await providerSepolia.getClassAt(addrContractSepolia);
// if (contractAbi === undefined) {
//   throw new Error('no abi.');
// }

// // Connect to the contract Katana/Slot
// export const totNFTContract = new Contract(contractAbi, addrContract, provider);

// // Connect to the contract Sepolia
// export const totNFTContractSepolia = new Contract(contractAbiSepolia, addrContractSepolia, providerSepolia);

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
