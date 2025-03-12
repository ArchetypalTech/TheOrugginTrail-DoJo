// // Internals
// import { addrContract, initializeContracts } from "./constants.js";
// import WalletStore from "@lib/stores/wallet.store";

// // Get the balance of the FerryTicket via command
// export async function getBalance(): Promise<string> {
// 	try {
// 		// Initialize contracts (this may take some time)
// 		const { totNFTContract, totNFTContractSepolia } = await initializeContracts();
// 		try {
// 			const wallet = get(walletStore);
// 			if (!wallet.isConnected) {
// 				throw new Error("Wallet is not connected");
// 			}
// 			// Get the balance of the address stored in walletAddress
// 			const balance: bigint = await totNFTContract.balance_of(
// 				wallet.walletAddress,
// 			);
// 			const raw_symbol: string = await totNFTContract.symbol();
// 			// Convert the number to BigInt
// 			const symbolBigInt = BigInt(raw_symbol);
// 			// Convert BigInt to hex and then to a string
// 			const symbolHex = symbolBigInt.toString(16); // Hex representation
// 			const symbol = Buffer.from(symbolHex, "hex").toString("utf-8");
// 			//console.log('------>FT balance is: ', Number(balance));
// 			// Return the corresponding message
// 			if (Number(balance) > 1) {
// 				return `You have ${Number(balance)} ${symbol}'s in your wallet on Katana.`;
// 			}
// 			if (Number(balance) > 0 && Number(balance) < 2) {
// 				return `You have ${Number(balance)} ${symbol} in your wallet on Katana.`;
// 			}
// 			return `You have ${Number(balance)} ${symbol}'s in your wallet on Katana.`;
// 		} catch (error) {
// 			console.error("Error checking token balance:", error);
// 			return `Error: ${(error as Error).message || "An unknown error occurred."}`;
// 		}
// 	} catch (error) {
// 		console.error("Error initializing contracts:", error);
// 		return `Error initializing contracts: ${(error as Error).message || "An unknown error occurred."}`;
// 	}
// }

// // Get the balance of the FerryTicket for playing
// export async function getBalance2(): Promise<number> {
// 	try {
// 		// Initialize contracts (this may take some time)
// 		const { totNFTContract, totNFTContractSepolia } = await initializeContracts();

// 		try {
// 			// Get the balance of the address stored in walletAddress
// 			const balance: bigint = await totNFTContract.balance_of(
// 				get(walletStore).walletAddress,
// 			);
// 			//console.log('------>FT balance is: ', Number(balance));
// 			// Return the corresponding value
// 			return Number(balance);
// 		} catch (error) {
// 			console.error("Error checking token balance:", error);
// 			return 0; // If there is an error, set to 0 and cannot play.
// 		}
// 	} catch (error) {
// 		console.error("Error initializing contracts:", error);
// 		return 0;
// 	}
// }

// // Mint the Ferry Ticket Token
// export async function mintToken(): Promise<number | string> {
// 	const wallet = get(walletStore);
// 	if (!wallet.isConnected) {
// 		throw new Error("Wallet is not connected");
// 	}
// 	try {
// 		if (!wallet.walletAddress) {
// 			throw new Error("Wallet address is undefined");
// 		}

// 		// Prepare the transaction object with valid calldata
// 		const transaction = {
// 			contractAddress: addrContract, // Address of the NFT contract
// 			entrypoint: "mint",
// 			calldata: [wallet], // Wallet address to mint the token to
// 		};

// 		// Execute the transaction
// 		const mint = await wallet.controller?.account?.execute(transaction);

// 		console.log("Result of minting:", mint);

// 		return `You have successfully minted a TOT Token. Your Transaction hash is ${mint?.transaction_hash}`;
// 	} catch (error) {
// 		console.error("Error minting token:", error);
// 		if ((error as Error).message.includes("USER_REFUSED_OP")) {
// 			return `Transaction rejected by user.`;
// 		}
// 		return `Error: ${(error as Error).message || "An unknown error occurred."}`;
// 	}
// }

// // Transfer the Ferry Ticket Token
// export async function transferToken(
// 	recipientAddrss: string,
// 	token_id: number,
// ): Promise<string> {
// 	const wallet = get(walletStore);
// 	console.log("wallet address connected to controller is", wallet.walletAddress);
// 	const { totNFTContract } = await initializeContracts();
// 	try {
// 		if (!wallet.walletAddress) {
// 			throw new Error("Wallet address is undefined");
// 		}

// 		console.log("Token ID passed as number is:", token_id);

// 		// Convert token_id to BigInt
// 		const tokenIdBN = BigInt(token_id);

// 		// Split the token ID into low and high 128-bit parts
// 		const low = (
// 			tokenIdBN & BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
// 		).toString(); // Low 128 bits
// 		const high = (tokenIdBN >> BigInt(128)).toString(); // High 128 bits

// 		console.log("Token ID low:", low);
// 		console.log("Token ID high:", high);

// 		// Prepare the transaction object with valid calldata
// 		const transaction = {
// 			contractAddress: addrContract,
// 			entrypoint: "transfer_from",
// 			calldata: [
// 				wallet, // 'from' address (wallet address)
// 				recipientAddrss, // 'to' address (recipient address)
// 				low, // Low 128 bits of token_id
// 				high, // High 128 bits of token_id
// 			],
// 		};

// 		// Execute the transaction
// 		const transferFT = await wallet.controller?.account?.execute(transaction);
// 		const raw_symbol: string = await totNFTContract.symbol();
// 		// Convert the number to BigInt
// 		const symbolBigInt = BigInt(raw_symbol);
// 		// Convert BigInt to hex and then to a string
// 		const symbolHex = symbolBigInt.toString(16); // Hex representation
// 		const symbol = Buffer.from(symbolHex, "hex").toString("utf-8");

// 		console.log("Result of transferring is:", transferFT);
// 		if (transferFT?.transaction_hash) {
// 			// Return the transaction hash upon success
// 			return `Successfully transferred a ${symbol} with ID ${token_id}. Transaction hash: ${transferFT.transaction_hash}`;
// 		}
// 		// If no transaction hash is returned, throw an error
// 		throw new Error("Transaction failed: No transaction hash returned");
// 	} catch (error) {
// 		// Enhanced error handling
// 		if ((error as Error).message.includes("USER_REFUSED_OP")) {
// 			console.error("Error transferring token: Transaction rejected by user.");
// 			return `Transaction rejected by user. Please check your wallet and try again.`;
// 		}
// 		console.error("Error transferring token:", error);
// 		// Return a generic error message if it's another type of failure
// 		return `Error: ${(error as Error).message || "An unknown error occurred."}`;
// 	}
// }
