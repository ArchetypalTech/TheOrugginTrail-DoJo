<script lang="ts">
import { onMount } from "svelte";
import { get } from "svelte/store";

import { ORUG_CONFIG } from "$lib/config";
import {
	accountArgentX,
	accountController,
	connectedToArX,
	connectedToCGC,
	username,
	walletAddressArX,
	walletAddressCont,
} from "$lib/stores/wallet_store";
import { addrContract } from "$lib/tokens/constants";
// Controller - Cartridge
import Controller from "@cartridge/controller";

// Argent X - Wallet
import { connect, disconnect } from "get-starknet";

// Starknet.js
import { WalletAccount } from "starknet";

// States and variables
let loading = true;
let errorMessage: string | null = null;

//--------------Cartridge Game Controller--------------//
// Controller setup and methods
const controller = new Controller({
	colorMode: "dark",
	//theme: "here will go our theme that needs to be designed and added",
	// Policies are required to be defined better
	policies: {
		contracts: {
			[ORUG_CONFIG.manifest.entity.address]: {
				name: "The Oruggin Trail", // Optional, can be added if you want a name
				description:
					"Approve or reject submitting transactions to play The Oruggin Trail",
				methods: [
					{
						entrypoint: "approve", // The actual method name
						description: "Approve submitting transactions to play The Oruggin Trail",
					},
					{
						entrypoint: "reject", // The actual method name
						description: "Reject submitting transactions to play The Oruggin Trail",
					},
				],
			},
			[addrContract]: {
				name: "TOT NFT", // Optional
				description: "Mint and transfer TOT tokens",
				methods: [
					{
						entrypoint: "mint", // The actual method name
						description: "Approve minting a TOT Token",
					},
					{
						entrypoint: "transfer_from", // The actual method name
						description: "Transfer a TOT Token",
					},
				],
			},
		},
	},
	// Network to connect to
	// Can be mainnet, sepolia, slot
	chains: [
		{
			rpcUrl: "https://api.cartridge.gg/x/theoruggintrail/katana", // Use `rpcUrl` here
		},
	],
	defaultChainId: ORUG_CONFIG.token.chainId,
	//rpc: "https://api.cartridge.gg/x/starknet/sepolia",

	// List of tokens to follow
	tokens: {
		erc20: [ORUG_CONFIG.token.erc20],
		//erc721: [addrContract],
	},
	slot: "theoruggintrail",
});

// Connect to Cartridge Game Controller
async function connectCGC() {
	loading = true;
	try {
		const res = await controller.connect(); // Get response from the connection
		console.log("res is", res);

		if (!res) {
			throw new Error("No response from Cartridge Game Controller");
		}
		accountController.set(res); // Store the controller
		console.log("storedController-controller is ", get(accountController));

		username.set(await controller.username()); // Store the username

		walletAddressCont.set(res.address); // Store the account address.

		if (!get(connectedToCGC)) {
			connectedToCGC.set(true); // Store the connected status to true
			console.log("Username is", get(username));
			console.log("accountController address is", get(walletAddressCont));
		}
	} catch (e) {
		handleError(e);
	} finally {
		loading = false;
	}
}

// Open the controller's profile
const openUserProfile = () => {
	controller.openProfile("inventory");
};

// Disconnect from Cartridge Game Controller
function disconnectCGC() {
	controller.disconnect(); // Disconnect the controller
	accountController.set(undefined); // Set to undefine the account
	username.set(undefined); // Set to undefine the username
	walletAddressCont.set(undefined); // Set to undefine the accountAddr
	connectedToCGC.set(false); // Set to false the connected status
}

//--------------Argent X Wallet--------------//
// Connect to Argent X wallet
const connectWallet = async () => {
	const selectedWalletSWO = await connect({
		modalMode: "alwaysAsk",
		modalTheme: "system",
	});

	// Define myWalletAccount based on the connected wallet above
	const myWalletAccount = new WalletAccount(
		{ nodeUrl: ORUG_CONFIG.endpoints.katana },
		selectedWalletSWO,
	);

	// If defined
	if (myWalletAccount) {
		// Store the wallet and the account address
		accountArgentX.set(myWalletAccount);
		walletAddressArX.set(myWalletAccount.walletProvider?.selectedAddress);

		// If local variable not connected to Argent X
		if (!get(connectedToArX)) {
			// Set local variable connected to true
			connectedToArX.set(true);
			// Debug
			console.log("wallet address is:", get(walletAddressArX));
			console.log("wallet is on:", myWalletAccount);
		}
	}
};

// Disconnect to Argent X wallet
const disconnectWallet = async () => {
	await disconnect();
	accountArgentX.set(null);
	walletAddressArX.set(undefined);
	connectedToArX.set(false);
};

// Error handling
function handleError(error: unknown) {
	errorMessage = "An error occurred. Please try again.";
	console.error("Application error:", error);
}

onMount(async () => {
	// Try to connect to a previous cartridge controller
	try {
		if (await controller.probe()) {
			await connectCGC();
		}
	} catch (error) {
		handleError(error);
	} finally {
		loading = false;
	}
});
</script>
  
<style>
  .wallet-container {
    font-family: monospace;
    background-color: black;
    color: orange;
    border: 1px solid orange;
    border-radius: 0.375rem;
    padding: 1rem;
    position: relative;
    min-height: 75px;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 1rem;
    position: relative;
    flex-wrap: wrap; /* Ensures buttons wrap on smaller screens */
  }

  .loading-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85); /* Slightly darker for better contrast */
    color: #FFA500;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    font-size: 1rem; /* Larger for better visibility */
    text-align: center;
  }

  .error-message {
    color: red;
    font-size: 1rem;
    margin-top: 1rem;
    text-align: center; /* Center for uniformity */
  }

  @media (max-width: 768px) {
    .account-panel {
      width: 90%;
    }

    .button-container {
      gap: 5px;
    }
  }
</style>

<div class="wallet-container">
  <div>Archetypal Tech Wallet Facility no:23</div>
  <div class="button-container">
    {#if loading}
      <span class="loading-text">Loading...</span>
    {:else}
      <!--For Cartride Controller -->
      {#if $accountController}
        <button on:click={openUserProfile}>{get(username)}'s Inventory</button>
        <span class="-|-"> -|-</span>
        <button on:click={disconnectCGC}>Disconnect Controller</button>
      {:else}
        <button on:click={connectCGC}>Connect Controller</button>
      {/if}
      <span class="||"> || </span>
       <!--For Argent x -->
      {#if $walletAddressArX}
      <button on:click={disconnectWallet}>Disconnect Wallet</button>
      {:else}
      <button on:click={connectWallet}>Connect Wallet</button>
      {/if}

    {/if}
  </div>
</div>

{#if errorMessage}
  <div class="error-message">{errorMessage}</div>
{/if}