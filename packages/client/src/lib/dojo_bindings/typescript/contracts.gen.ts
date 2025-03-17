import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_designer_createActions_calldata = (t: Array<Action>): DojoCall => {
		return {
			contractName: "designer",
			entrypoint: "create_actions",
			calldata: [t],
		};
	};

	const designer_createActions = async (snAccount: Account | AccountInterface, t: Array<Action>) => {
		try {
			return await provider.execute(
				snAccount,
				build_designer_createActions_calldata(t),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_designer_createObjects_calldata = (t: Array<Object>): DojoCall => {
		return {
			contractName: "designer",
			entrypoint: "create_objects",
			calldata: [t],
		};
	};

	const designer_createObjects = async (snAccount: Account | AccountInterface, t: Array<Object>) => {
		try {
			return await provider.execute(
				snAccount,
				build_designer_createObjects_calldata(t),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_designer_createRooms_calldata = (t: Array<Room>): DojoCall => {
		return {
			contractName: "designer",
			entrypoint: "create_rooms",
			calldata: [t],
		};
	};

	const designer_createRooms = async (snAccount: Account | AccountInterface, t: Array<Room>) => {
		try {
			return await provider.execute(
				snAccount,
				build_designer_createRooms_calldata(t),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_designer_createTxts_calldata = (t: Array<Txtdef>): DojoCall => {
		return {
			contractName: "designer",
			entrypoint: "create_txts",
			calldata: [t],
		};
	};

	const designer_createTxts = async (snAccount: Account | AccountInterface, t: Array<Txtdef>) => {
		try {
			return await provider.execute(
				snAccount,
				build_designer_createTxts_calldata(t),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_meatpuppet_listen_calldata = (cmd: Array<ByteArray>, add: BigNumberish): DojoCall => {
		return {
			contractName: "meatpuppet",
			entrypoint: "listen",
			calldata: [cmd, add],
		};
	};

	const meatpuppet_listen = async (snAccount: Account | AccountInterface, cmd: Array<ByteArray>, add: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_meatpuppet_listen_calldata(cmd, add),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		designer: {
			createActions: designer_createActions,
			buildCreateActionsCalldata: build_designer_createActions_calldata,
			createObjects: designer_createObjects,
			buildCreateObjectsCalldata: build_designer_createObjects_calldata,
			createRooms: designer_createRooms,
			buildCreateRoomsCalldata: build_designer_createRooms_calldata,
			createTxts: designer_createTxts,
			buildCreateTxtsCalldata: build_designer_createTxts_calldata,
		},
		meatpuppet: {
			listen: meatpuppet_listen,
			buildListenCalldata: build_meatpuppet_listen_calldata,
		},
	};
}