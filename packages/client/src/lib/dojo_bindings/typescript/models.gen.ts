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
	name: string;
	altNames: Array<string>;
}

// Type definition for `the_oruggin_trail::models::object::ObjectValue` struct
export interface ObjectValue {
	objType: ObjectTypeEnum;
	dirType: DirectionTypeEnum;
	destId: BigNumberish;
	matType: MaterialTypeEnum;
	objectActionIds: Array<BigNumberish>;
	txtDefId: BigNumberish;
	name: string;
	altNames: Array<string>;
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
export const actionType = [
	'None',
	'Move',
	'Look',
	'Kick',
	'Hit',
	'Drink',
	'Fight',
	'Sleep',
	'Smash',
	'Pray',
	'Open',
	'Break',
	'Burn',
	'Light',
	'Ignite',
	'Spawn',
	'Take',
	'Inventory',
	'Pour',
	'Follow',
	'Jump',
	'Block',
	'Soak',
	'Empty',
	'Explode',
	'Disintegrate',
	'Close',
	'Drop',
] as const;
export type ActionType = { [key in typeof actionType[number]]: string };
export type ActionTypeEnum = CairoCustomEnum;

// Type definition for `the_oruggin_trail::models::zrk_enums::BiomeType` enum
export const biomeType = [
	'None',
	'Forest',
	'Tundra',
	'Arctic',
	'Desert',
	'Temporate',
	'Faery',
	'Demon',
	'Mountains',
	'Prarie',
] as const;
export type BiomeType = { [key in typeof biomeType[number]]: string };
export type BiomeTypeEnum = CairoCustomEnum;

// Type definition for `the_oruggin_trail::models::zrk_enums::DirectionType` enum
export const directionType = [
	'None',
	'North',
	'East',
	'South',
	'West',
	'Up',
	'Down',
	'Left',
	'Right',
] as const;
export type DirectionType = { [key in typeof directionType[number]]: string };
export type DirectionTypeEnum = CairoCustomEnum;

// Type definition for `the_oruggin_trail::models::zrk_enums::MaterialType` enum
export const materialType = [
	'None',
	'Wood',
	'Dirt',
	'Stone',
	'Flesh',
	'Glass',
	'IKEA',
	'Iron',
	'Shit',
	'Mud',
	'Leather',
	'Metal',
	'TNT',
	'Hay',
] as const;
export type MaterialType = { [key in typeof materialType[number]]: string };
export type MaterialTypeEnum = CairoCustomEnum;

// Type definition for `the_oruggin_trail::models::zrk_enums::ObjectType` enum
export const objectType = [
	'None',
	'Ball',
	'Window',
	'Door',
	'Stairs',
	'Place',
	'Troll',
	'Path',
	'Chest',
	'Box',
	'Matches',
	'Petrol',
	'Can',
	'Dynamite',
	'Boulder',
	'Bale',
] as const;
export type ObjectType = { [key in typeof objectType[number]]: string };
export type ObjectTypeEnum = CairoCustomEnum;

// Type definition for `the_oruggin_trail::models::zrk_enums::RoomType` enum
export const roomType = [
	'None',
	'WoodCabin',
	'Store',
	'Cavern',
	'Basement',
	'StoneCabin',
	'Fort',
	'Room',
	'Plain',
	'Mountains',
	'Barn',
	'Forge',
	'Pass',
	'Alley',
] as const;
export type RoomType = { [key in typeof roomType[number]]: string };
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
				Inventory: undefined,
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
				Inventory: undefined,
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
		name: "",
			altNames: [""],
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
		name: "",
			altNames: [""],
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
	Txtdef = 'the_oruggin_trail-Txtdef',
	TxtdefValue = 'the_oruggin_trail-TxtdefValue',
	ActionType = 'the_oruggin_trail-ActionType',
	BiomeType = 'the_oruggin_trail-BiomeType',
	DirectionType = 'the_oruggin_trail-DirectionType',
	MaterialType = 'the_oruggin_trail-MaterialType',
	ObjectType = 'the_oruggin_trail-ObjectType',
	RoomType = 'the_oruggin_trail-RoomType',
}