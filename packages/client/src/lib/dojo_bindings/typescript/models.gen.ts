import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, type BigNumberish } from 'starknet';

// Type definition for `the_oruggin_trail::models::action::Action` struct
export interface Action {
	actionId: BigNumberish;
	actionType: ActionTypeEnum;
	dBitTxt: string;
	enabled: boolean;
	revertable: boolean;
	dBit: boolean;
	affectsActionId: BigNumberish;
	affectedByActionId: BigNumberish;
}

// Type definition for `the_oruggin_trail::models::action::ActionValue` struct
export interface ActionValue {
	actionType: ActionTypeEnum;
	dBitTxt: string;
	enabled: boolean;
	revertable: boolean;
	dBit: boolean;
	affectsActionId: BigNumberish;
	affectedByActionId: BigNumberish;
}

// Type definition for `the_oruggin_trail::models::inventory::Inventory` struct
export interface Inventory {
	owner_id: BigNumberish;
	items: Array<BigNumberish>;
}

// Type definition for `the_oruggin_trail::models::inventory::InventoryValue` struct
export interface InventoryValue {
	items: Array<BigNumberish>;
}

// Type definition for `the_oruggin_trail::models::object::Object` struct
export interface Object {
	objectId: BigNumberish;
	objType: ObjectTypeEnum;
	dirType: DirectionTypeEnum;
	destId: BigNumberish;
	matType: MaterialTypeEnum;
	objectActionIds: Array<BigNumberish>;
	txtDefId: BigNumberish;
}

// Type definition for `the_oruggin_trail::models::object::ObjectValue` struct
export interface ObjectValue {
	objType: ObjectTypeEnum;
	dirType: DirectionTypeEnum;
	destId: BigNumberish;
	matType: MaterialTypeEnum;
	objectActionIds: Array<BigNumberish>;
	txtDefId: BigNumberish;
}

// Type definition for `the_oruggin_trail::models::output::Output` struct
export interface Output {
	playerId: BigNumberish;
	text_o_vision: string;
}

// Type definition for `the_oruggin_trail::models::output::OutputValue` struct
export interface OutputValue {
	text_o_vision: string;
}

// Type definition for `the_oruggin_trail::models::player::Player` struct
export interface Player {
	player_id: BigNumberish;
	player_adr: string;
	location: BigNumberish;
	inventory: BigNumberish;
}

// Type definition for `the_oruggin_trail::models::player::PlayerValue` struct
export interface PlayerValue {
	player_adr: string;
	location: BigNumberish;
	inventory: BigNumberish;
}

// Type definition for `the_oruggin_trail::models::room::Room` struct
export interface Room {
	roomId: BigNumberish;
	roomType: RoomTypeEnum;
	biomeType: BiomeTypeEnum;
	txtDefId: BigNumberish;
	shortTxt: string;
	objectIds: Array<BigNumberish>;
	dirObjIds: Array<BigNumberish>;
	players: Array<BigNumberish>;
}

// Type definition for `the_oruggin_trail::models::room::RoomValue` struct
export interface RoomValue {
	roomType: RoomTypeEnum;
	biomeType: BiomeTypeEnum;
	txtDefId: BigNumberish;
	shortTxt: string;
	objectIds: Array<BigNumberish>;
	dirObjIds: Array<BigNumberish>;
	players: Array<BigNumberish>;
}

// Type definition for `the_oruggin_trail::models::spawnroom::Spawnroom` struct
export interface Spawnroom {
	id: BigNumberish;
	rooms: Array<BigNumberish>;
}

// Type definition for `the_oruggin_trail::models::spawnroom::SpawnroomValue` struct
export interface SpawnroomValue {
	rooms: Array<BigNumberish>;
}

// Type definition for `the_oruggin_trail::models::txtdef::Txtdef` struct
export interface Txtdef {
	id: BigNumberish;
	owner: BigNumberish;
	text: string;
}

// Type definition for `the_oruggin_trail::models::txtdef::TxtdefValue` struct
export interface TxtdefValue {
	owner: BigNumberish;
	text: string;
}

// Type definition for `the_oruggin_trail::models::zrk_enums::ActionType` enum
export type ActionType = {
	None: string;
	Move: string;
	Look: string;
	Kick: string;
	Hit: string;
	Drink: string;
	Fight: string;
	Sleep: string;
	Smash: string;
	Pray: string;
	Open: string;
	Break: string;
	Burn: string;
	Light: string;
	Ignite: string;
	Spawn: string;
	Take: string;
	Help: string;
	Pour: string;
	Follow: string;
	Jump: string;
	Block: string;
	Soak: string;
	Empty: string;
	Explode: string;
	Disintegrate: string;
	Close: string;
	Drop: string;
}
export type ActionTypeEnum = CairoCustomEnum;

// Type definition for `the_oruggin_trail::models::zrk_enums::BiomeType` enum
export type BiomeType = {
	None: string;
	Forest: string;
	Tundra: string;
	Arctic: string;
	Desert: string;
	Temporate: string;
	Faery: string;
	Demon: string;
	Mountains: string;
	Prarie: string;
}
export type BiomeTypeEnum = CairoCustomEnum;

// Type definition for `the_oruggin_trail::models::zrk_enums::DirectionType` enum
export type DirectionType = {
	None: string;
	North: string;
	East: string;
	South: string;
	West: string;
	Up: string;
	Down: string;
	Left: string;
	Right: string;
}
export type DirectionTypeEnum = CairoCustomEnum;

// Type definition for `the_oruggin_trail::models::zrk_enums::MaterialType` enum
export type MaterialType = {
	None: string;
	Wood: string;
	Dirt: string;
	Stone: string;
	Flesh: string;
	Glass: string;
	IKEA: string;
	Iron: string;
	Shit: string;
	Mud: string;
	Leather: string;
	Metal: string;
	TNT: string;
	Hay: string;
}
export type MaterialTypeEnum = CairoCustomEnum;

// Type definition for `the_oruggin_trail::models::zrk_enums::ObjectType` enum
export type ObjectType = {
	None: string;
	Ball: string;
	Window: string;
	Door: string;
	Stairs: string;
	Place: string;
	Troll: string;
	Path: string;
	Chest: string;
	Box: string;
	Matches: string;
	Petrol: string;
	Can: string;
	Dynamite: string;
	Boulder: string;
	Bale: string;
}
export type ObjectTypeEnum = CairoCustomEnum;

// Type definition for `the_oruggin_trail::models::zrk_enums::RoomType` enum
export type RoomType = {
	None: string;
	WoodCabin: string;
	Store: string;
	Cavern: string;
	Basement: string;
	StoneCabin: string;
	Fort: string;
	Room: string;
	Plain: string;
	Mountains: string;
	Barn: string;
	Forge: string;
	Pass: string;
	Alley: string;
}
export type RoomTypeEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	the_oruggin_trail: {
		Action: Action,
		ActionValue: ActionValue,
		Inventory: Inventory,
		InventoryValue: InventoryValue,
		Object: Object,
		ObjectValue: ObjectValue,
		Output: Output,
		OutputValue: OutputValue,
		Player: Player,
		PlayerValue: PlayerValue,
		Room: Room,
		RoomValue: RoomValue,
		Spawnroom: Spawnroom,
		SpawnroomValue: SpawnroomValue,
		Txtdef: Txtdef,
		TxtdefValue: TxtdefValue,
	},
}
export const schema: SchemaType = {
	the_oruggin_trail: {
		Action: {
			actionId: 0,
		actionType: new CairoCustomEnum({ 
					None: "",
				Move: undefined,
				Look: undefined,
				Kick: undefined,
				Hit: undefined,
				Drink: undefined,
				Fight: undefined,
				Sleep: undefined,
				Smash: undefined,
				Pray: undefined,
				Open: undefined,
				Break: undefined,
				Burn: undefined,
				Light: undefined,
				Ignite: undefined,
				Spawn: undefined,
				Take: undefined,
				Help: undefined,
				Pour: undefined,
				Follow: undefined,
				Jump: undefined,
				Block: undefined,
				Soak: undefined,
				Empty: undefined,
				Explode: undefined,
				Disintegrate: undefined,
				Close: undefined,
				Drop: undefined, }),
		dBitTxt: "",
			enabled: false,
			revertable: false,
			dBit: false,
			affectsActionId: 0,
			affectedByActionId: 0,
		},
		ActionValue: {
		actionType: new CairoCustomEnum({ 
					None: "",
				Move: undefined,
				Look: undefined,
				Kick: undefined,
				Hit: undefined,
				Drink: undefined,
				Fight: undefined,
				Sleep: undefined,
				Smash: undefined,
				Pray: undefined,
				Open: undefined,
				Break: undefined,
				Burn: undefined,
				Light: undefined,
				Ignite: undefined,
				Spawn: undefined,
				Take: undefined,
				Help: undefined,
				Pour: undefined,
				Follow: undefined,
				Jump: undefined,
				Block: undefined,
				Soak: undefined,
				Empty: undefined,
				Explode: undefined,
				Disintegrate: undefined,
				Close: undefined,
				Drop: undefined, }),
		dBitTxt: "",
			enabled: false,
			revertable: false,
			dBit: false,
			affectsActionId: 0,
			affectedByActionId: 0,
		},
		Inventory: {
			owner_id: 0,
			items: [0],
		},
		InventoryValue: {
			items: [0],
		},
		Object: {
			objectId: 0,
		objType: new CairoCustomEnum({ 
					None: "",
				Ball: undefined,
				Window: undefined,
				Door: undefined,
				Stairs: undefined,
				Place: undefined,
				Troll: undefined,
				Path: undefined,
				Chest: undefined,
				Box: undefined,
				Matches: undefined,
				Petrol: undefined,
				Can: undefined,
				Dynamite: undefined,
				Boulder: undefined,
				Bale: undefined, }),
		dirType: new CairoCustomEnum({ 
					None: "",
				North: undefined,
				East: undefined,
				South: undefined,
				West: undefined,
				Up: undefined,
				Down: undefined,
				Left: undefined,
				Right: undefined, }),
			destId: 0,
		matType: new CairoCustomEnum({ 
					None: "",
				Wood: undefined,
				Dirt: undefined,
				Stone: undefined,
				Flesh: undefined,
				Glass: undefined,
				IKEA: undefined,
				Iron: undefined,
				Shit: undefined,
				Mud: undefined,
				Leather: undefined,
				Metal: undefined,
				TNT: undefined,
				Hay: undefined, }),
			objectActionIds: [0],
			txtDefId: 0,
		},
		ObjectValue: {
		objType: new CairoCustomEnum({ 
					None: "",
				Ball: undefined,
				Window: undefined,
				Door: undefined,
				Stairs: undefined,
				Place: undefined,
				Troll: undefined,
				Path: undefined,
				Chest: undefined,
				Box: undefined,
				Matches: undefined,
				Petrol: undefined,
				Can: undefined,
				Dynamite: undefined,
				Boulder: undefined,
				Bale: undefined, }),
		dirType: new CairoCustomEnum({ 
					None: "",
				North: undefined,
				East: undefined,
				South: undefined,
				West: undefined,
				Up: undefined,
				Down: undefined,
				Left: undefined,
				Right: undefined, }),
			destId: 0,
		matType: new CairoCustomEnum({ 
					None: "",
				Wood: undefined,
				Dirt: undefined,
				Stone: undefined,
				Flesh: undefined,
				Glass: undefined,
				IKEA: undefined,
				Iron: undefined,
				Shit: undefined,
				Mud: undefined,
				Leather: undefined,
				Metal: undefined,
				TNT: undefined,
				Hay: undefined, }),
			objectActionIds: [0],
			txtDefId: 0,
		},
		Output: {
			playerId: 0,
		text_o_vision: "",
		},
		OutputValue: {
		text_o_vision: "",
		},
		Player: {
			player_id: 0,
			player_adr: "",
			location: 0,
			inventory: 0,
		},
		PlayerValue: {
			player_adr: "",
			location: 0,
			inventory: 0,
		},
		Room: {
			roomId: 0,
		roomType: new CairoCustomEnum({ 
					None: "",
				WoodCabin: undefined,
				Store: undefined,
				Cavern: undefined,
				Basement: undefined,
				StoneCabin: undefined,
				Fort: undefined,
				Room: undefined,
				Plain: undefined,
				Mountains: undefined,
				Barn: undefined,
				Forge: undefined,
				Pass: undefined,
				Alley: undefined, }),
		biomeType: new CairoCustomEnum({ 
					None: "",
				Forest: undefined,
				Tundra: undefined,
				Arctic: undefined,
				Desert: undefined,
				Temporate: undefined,
				Faery: undefined,
				Demon: undefined,
				Mountains: undefined,
				Prarie: undefined, }),
			txtDefId: 0,
		shortTxt: "",
			objectIds: [0],
			dirObjIds: [0],
			players: [0],
		},
		RoomValue: {
		roomType: new CairoCustomEnum({ 
					None: "",
				WoodCabin: undefined,
				Store: undefined,
				Cavern: undefined,
				Basement: undefined,
				StoneCabin: undefined,
				Fort: undefined,
				Room: undefined,
				Plain: undefined,
				Mountains: undefined,
				Barn: undefined,
				Forge: undefined,
				Pass: undefined,
				Alley: undefined, }),
		biomeType: new CairoCustomEnum({ 
					None: "",
				Forest: undefined,
				Tundra: undefined,
				Arctic: undefined,
				Desert: undefined,
				Temporate: undefined,
				Faery: undefined,
				Demon: undefined,
				Mountains: undefined,
				Prarie: undefined, }),
			txtDefId: 0,
		shortTxt: "",
			objectIds: [0],
			dirObjIds: [0],
			players: [0],
		},
		Spawnroom: {
			id: 0,
			rooms: [0],
		},
		SpawnroomValue: {
			rooms: [0],
		},
		Txtdef: {
			id: 0,
			owner: 0,
		text: "",
		},
		TxtdefValue: {
			owner: 0,
		text: "",
		},
	},
};
export enum ModelsMapping {
	Action = 'the_oruggin_trail-Action',
	ActionValue = 'the_oruggin_trail-ActionValue',
	Inventory = 'the_oruggin_trail-Inventory',
	InventoryValue = 'the_oruggin_trail-InventoryValue',
	Object = 'the_oruggin_trail-Object',
	ObjectValue = 'the_oruggin_trail-ObjectValue',
	Output = 'the_oruggin_trail-Output',
	OutputValue = 'the_oruggin_trail-OutputValue',
	Player = 'the_oruggin_trail-Player',
	PlayerValue = 'the_oruggin_trail-PlayerValue',
	Room = 'the_oruggin_trail-Room',
	RoomValue = 'the_oruggin_trail-RoomValue',
	Spawnroom = 'the_oruggin_trail-Spawnroom',
	SpawnroomValue = 'the_oruggin_trail-SpawnroomValue',
	Txtdef = 'the_oruggin_trail-Txtdef',
	TxtdefValue = 'the_oruggin_trail-TxtdefValue',
	ActionType = 'the_oruggin_trail-ActionType',
	BiomeType = 'the_oruggin_trail-BiomeType',
	DirectionType = 'the_oruggin_trail-DirectionType',
	MaterialType = 'the_oruggin_trail-MaterialType',
	ObjectType = 'the_oruggin_trail-ObjectType',
	RoomType = 'the_oruggin_trail-RoomType',
}