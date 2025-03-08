import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_meatpuppet_commandShoggoth_calldata = (victim: BigNumberish, wish: Array<ByteArray>): DojoCall => {
		return {
			contractName: "meatpuppet",
			entrypoint: "command_shoggoth",
			calldata: [victim, wish],
		};
	};

	const meatpuppet_commandShoggoth = async (snAccount: Account | AccountInterface, victim: BigNumberish, wish: Array<ByteArray>) => {
		try {
			return await provider.execute(
				snAccount,
				build_meatpuppet_commandShoggoth_calldata(victim, wish),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

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

	const build_designer_createTxt_calldata = (id: BigNumberish, ownedBy: BigNumberish, val: ByteArray): DojoCall => {
		return {
			contractName: "designer",
			entrypoint: "create_txt",
			calldata: [id, ownedBy, val],
		};
	};

	const designer_createTxt = async (snAccount: Account | AccountInterface, id: BigNumberish, ownedBy: BigNumberish, val: ByteArray) => {
		try {
			return await provider.execute(
				snAccount,
				build_designer_createTxt_calldata(id, ownedBy, val),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_meatpuppet_listen_calldata = (cmd: Array<ByteArray>, pId: BigNumberish): DojoCall => {
		return {
			contractName: "meatpuppet",
			entrypoint: "listen",
			calldata: [cmd, pId],
		};
	};

	const meatpuppet_listen = async (snAccount: Account | AccountInterface, cmd: Array<ByteArray>, pId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_meatpuppet_listen_calldata(cmd, pId),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_spawner_setup_calldata = (): DojoCall => {
		return {
			contractName: "spawner",
			entrypoint: "setup",
			calldata: [],
		};
	};

	const spawner_setup = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_spawner_setup_calldata(),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_outputter_spawn_calldata = (): DojoCall => {
		return {
			contractName: "outputter",
			entrypoint: "spawn",
			calldata: [],
		};
	};

	const outputter_spawn = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_outputter_spawn_calldata(),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_spawner_spawnPlayer_calldata = (pid: BigNumberish, startRoom: BigNumberish): DojoCall => {
		return {
			contractName: "spawner",
			entrypoint: "spawn_player",
			calldata: [pid, startRoom],
		};
	};

	const spawner_spawnPlayer = async (snAccount: Account | AccountInterface, pid: BigNumberish, startRoom: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_spawner_spawnPlayer_calldata(pid, startRoom),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_outputter_updateOutput_calldata = (txt: ByteArray): DojoCall => {
		return {
			contractName: "outputter",
			entrypoint: "updateOutput",
			calldata: [txt],
		};
	};

	const outputter_updateOutput = async (snAccount: Account | AccountInterface, txt: ByteArray) => {
		try {
			return await provider.execute(
				snAccount,
				build_outputter_updateOutput_calldata(txt),
				"the_oruggin_trail",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		meatpuppet: {
			commandShoggoth: meatpuppet_commandShoggoth,
			buildCommandShoggothCalldata: build_meatpuppet_commandShoggoth_calldata,
			listen: meatpuppet_listen,
			buildListenCalldata: build_meatpuppet_listen_calldata,
		},
		designer: {
			createActions: designer_createActions,
			buildCreateActionsCalldata: build_designer_createActions_calldata,
			createObjects: designer_createObjects,
			buildCreateObjectsCalldata: build_designer_createObjects_calldata,
			createRooms: designer_createRooms,
			buildCreateRoomsCalldata: build_designer_createRooms_calldata,
			createTxt: designer_createTxt,
			buildCreateTxtCalldata: build_designer_createTxt_calldata,
		},
		spawner: {
			setup: spawner_setup,
			buildSetupCalldata: build_spawner_setup_calldata,
			spawnPlayer: spawner_spawnPlayer,
			buildSpawnPlayerCalldata: build_spawner_spawnPlayer_calldata,
		},
		outputter: {
			spawn: outputter_spawn,
			buildSpawnCalldata: build_outputter_spawn_calldata,
			updateOutput: outputter_updateOutput,
			buildUpdateOutputCalldata: build_outputter_updateOutput_calldata,
		},
	};
}