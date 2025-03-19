import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, type BigNumberish } from 'starknet';

// Type definition for `the_oruggin_trail::components::area::Area` struct
export interface Area {
	inst: BigNumberish;
	is_area: boolean;
	name: string;
	txtDefId: BigNumberish;
	object_ids: Array<BigNumberish>;
}

// Type definition for `the_oruggin_trail::components::area::AreaValue` struct
export interface AreaValue {
	is_area: boolean;
	name: string;
	txtDefId: BigNumberish;
	object_ids: Array<BigNumberish>;
}

// Type definition for `the_oruggin_trail::components::container::Container` struct
export interface Container {
	inst: BigNumberish;
	is_container: boolean;
	can_be_opened: boolean;
	can_receive_items: boolean;
	is_open: boolean;
	num_slots: BigNumberish;
	item_ids: Array<BigNumberish>;
	action_map: Array<string>;
}

// Type definition for `the_oruggin_trail::components::container::ContainerValue` struct
export interface ContainerValue {
	is_container: boolean;
	can_be_opened: boolean;
	can_receive_items: boolean;
	is_open: boolean;
	num_slots: BigNumberish;
	item_ids: Array<BigNumberish>;
	action_map: Array<string>;
}

// Type definition for `the_oruggin_trail::components::exit::Exit` struct
export interface Exit {
	inst: BigNumberish;
	is_exit: boolean;
	is_enterable: boolean;
	leads_to: BigNumberish;
	direction_type: DirectionTypeEnum;
	action_map: Array<string>;
}

// Type definition for `the_oruggin_trail::components::exit::ExitValue` struct
export interface ExitValue {
	is_exit: boolean;
	is_enterable: boolean;
	leads_to: BigNumberish;
	direction_type: DirectionTypeEnum;
	action_map: Array<string>;
}

// Type definition for `the_oruggin_trail::components::inspectable::Inspectable` struct
export interface Inspectable {
	inst: BigNumberish;
	is_inspectable: boolean;
	is_visible: boolean;
	text_id: BigNumberish;
}

// Type definition for `the_oruggin_trail::components::inspectable::InspectableValue` struct
export interface InspectableValue {
	is_inspectable: boolean;
	is_visible: boolean;
	text_id: BigNumberish;
}

// Type definition for `the_oruggin_trail::components::inventoryItem::InventoryItem` struct
export interface InventoryItem {
	inst: BigNumberish;
	is_inventory_item: boolean;
	owner_id: BigNumberish;
	can_be_picked_up: boolean;
	can_go_in_container: boolean;
}

// Type definition for `the_oruggin_trail::components::inventoryItem::InventoryItemValue` struct
export interface InventoryItemValue {
	is_inventory_item: boolean;
	owner_id: BigNumberish;
	can_be_picked_up: boolean;
	can_go_in_container: boolean;
}

// Type definition for `the_oruggin_trail::components::relations::ChildToParent` struct
export interface ChildToParent {
	inst: BigNumberish;
	is_child: boolean;
	parent: BigNumberish;
}

// Type definition for `the_oruggin_trail::components::relations::ChildToParentValue` struct
export interface ChildToParentValue {
	is_child: boolean;
	parent: BigNumberish;
}

// Type definition for `the_oruggin_trail::components::relations::ParentToChildren` struct
export interface ParentToChildren {
	inst: BigNumberish;
	is_parent: boolean;
	children: Array<BigNumberish>;
}

// Type definition for `the_oruggin_trail::components::relations::ParentToChildrenValue` struct
export interface ParentToChildrenValue {
	is_parent: boolean;
	children: Array<BigNumberish>;
}

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
	inst: BigNumberish;
	is_object: boolean;
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
	is_object: boolean;
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
	object_ids: Array<BigNumberish>;
	players: Array<BigNumberish>;
}

// Type definition for `the_oruggin_trail::models::room::RoomValue` struct
export interface RoomValue {
	roomType: RoomTypeEnum;
	biomeType: BiomeTypeEnum;
	txtDefId: BigNumberish;
	shortTxt: string;
	object_ids: Array<BigNumberish>;
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
	Inventory: string;
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
		Area: Area,
		AreaValue: AreaValue,
		Container: Container,
		ContainerValue: ContainerValue,
		Exit: Exit,
		ExitValue: ExitValue,
		Inspectable: Inspectable,
		InspectableValue: InspectableValue,
		InventoryItem: InventoryItem,
		InventoryItemValue: InventoryItemValue,
		ChildToParent: ChildToParent,
		ChildToParentValue: ChildToParentValue,
		ParentToChildren: ParentToChildren,
		ParentToChildrenValue: ParentToChildrenValue,
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
		Area: {
			inst: 0,
			is_area: false,
		name: "",
			txtDefId: 0,
			object_ids: [0],
		},
		AreaValue: {
			is_area: false,
		name: "",
			txtDefId: 0,
			object_ids: [0],
		},
		Container: {
			inst: 0,
			is_container: false,
			can_be_opened: false,
			can_receive_items: false,
			is_open: false,
			num_slots: 0,
			item_ids: [0],
			action_map: [""],
		},
		ContainerValue: {
			is_container: false,
			can_be_opened: false,
			can_receive_items: false,
			is_open: false,
			num_slots: 0,
			item_ids: [0],
			action_map: [""],
		},
		Exit: {
			inst: 0,
			is_exit: false,
			is_enterable: false,
			leads_to: 0,
		direction_type: new CairoCustomEnum({ 
					None: "",
				North: undefined,
				East: undefined,
				South: undefined,
				West: undefined,
				Up: undefined,
				Down: undefined,
				Left: undefined,
				Right: undefined, }),
			action_map: [""],
		},
		ExitValue: {
			is_exit: false,
			is_enterable: false,
			leads_to: 0,
		direction_type: new CairoCustomEnum({ 
					None: "",
				North: undefined,
				East: undefined,
				South: undefined,
				West: undefined,
				Up: undefined,
				Down: undefined,
				Left: undefined,
				Right: undefined, }),
			action_map: [""],
		},
		Inspectable: {
			inst: 0,
			is_inspectable: false,
			is_visible: false,
			text_id: 0,
		},
		InspectableValue: {
			is_inspectable: false,
			is_visible: false,
			text_id: 0,
		},
		InventoryItem: {
			inst: 0,
			is_inventory_item: false,
			owner_id: 0,
			can_be_picked_up: false,
			can_go_in_container: false,
		},
		InventoryItemValue: {
			is_inventory_item: false,
			owner_id: 0,
			can_be_picked_up: false,
			can_go_in_container: false,
		},
		ChildToParent: {
			inst: 0,
			is_child: false,
			parent: 0,
		},
		ChildToParentValue: {
			is_child: false,
			parent: 0,
		},
		ParentToChildren: {
			inst: 0,
			is_parent: false,
			children: [0],
		},
		ParentToChildrenValue: {
			is_parent: false,
			children: [0],
		},
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
			inst: 0,
			is_object: false,
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
			is_object: false,
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
			object_ids: [0],
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
			object_ids: [0],
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
	Area = 'the_oruggin_trail-Area',
	AreaValue = 'the_oruggin_trail-AreaValue',
	Container = 'the_oruggin_trail-Container',
	ContainerValue = 'the_oruggin_trail-ContainerValue',
	Exit = 'the_oruggin_trail-Exit',
	ExitValue = 'the_oruggin_trail-ExitValue',
	Inspectable = 'the_oruggin_trail-Inspectable',
	InspectableValue = 'the_oruggin_trail-InspectableValue',
	InventoryItem = 'the_oruggin_trail-InventoryItem',
	InventoryItemValue = 'the_oruggin_trail-InventoryItemValue',
	ChildToParent = 'the_oruggin_trail-ChildToParent',
	ChildToParentValue = 'the_oruggin_trail-ChildToParentValue',
	ParentToChildren = 'the_oruggin_trail-ParentToChildren',
	ParentToChildrenValue = 'the_oruggin_trail-ParentToChildrenValue',
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