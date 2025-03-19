use starknet::{get_caller_address};
use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};
use the_oruggin_trail::models::{
    player::{Player, PlayerImpl}, room::Room, object::{Object, ObjectTrait}, inventory::Inventory,
    txtdef::Txtdef, action::Action, zrk_enums::{ActionType, DirectionType}, output::Output,
};

pub fn getRoomObjects(world: WorldStorage, room: Room) -> Array<Object> {
    let mut objects: Array<Object> = array![];
    for inst in room.object_ids {
        let object: Object = world.read_model(inst);
        assert(object.clone().is_object(), 'Invalid roomObj');
        objects.append(object);
    };
    objects
}

pub fn getPlayerInventoryObjects(world: WorldStorage, player: Player) -> Array<Object> {
    let mut objects: Array<Object> = array![];
    let mut inventory: Inventory = world.read_model(player.inventory.clone());
    for inst in inventory.items {
        let object: Object = world.read_model(inst);
        assert(object.clone().is_object(), 'Invalid invObj');
        objects.append(object);
    };
    objects
}

pub fn getPlayerInventory(world: WorldStorage, player: Player) -> Inventory {
    let mut inventory: Inventory = world.read_model(player.inventory.clone());
    inventory
}

pub fn getNearbyObjects(world: WorldStorage, player: Player) -> Array<Object> {
    let mut objects: Array<Object> = array![];
    let mut room = getRoom(world, player);
    let mut roomObjects = getRoomObjects(world, room);
    let mut invObjects = getPlayerInventoryObjects(world, player);
    for object in roomObjects {
        objects.append(object);
    };
    for object in invObjects {
        objects.append(object);
    };
    objects
}

pub fn getRoom(world: WorldStorage, player: Player) -> Room {
    let room_id: felt252 = player.location;
    let room: Room = world.read_model(room_id);
    room
}

pub fn getRoomById(world: WorldStorage, room_id: felt252) -> Room {
    let room: Room = world.read_model(room_id);
    room
}

pub fn getRoomExitByDir(world: WorldStorage, room: Room, dir: DirectionType) -> felt252 {
    let objects = getRoomObjects(world, room);
    let mut destination_id = 0;
    for obj in objects {
        if destination_id != 0 {
            break;
        };
        if (obj.dirType != dir) {
            continue;
        }
        let actions = getObjectActions(world, obj.inst);
        for action in actions {
            if (action.actionType == ActionType::Open && action.enabled) {
                destination_id = obj.destId;
                break;
            };
        };
    };
    destination_id
}

pub fn getObjectById(world: WorldStorage, object_id: felt252) -> Object {
    let object: Object = world.read_model(object_id);
    object
}

pub fn getTextDefinition(world: WorldStorage, txt_id: felt252) -> Txtdef {
    let txt: Txtdef = world.read_model(txt_id);
    txt
}

pub fn getTextById(world: WorldStorage, txt_id: felt252) -> ByteArray {
    let txt: Txtdef = world.read_model(txt_id);
    txt.text
}

pub fn getActionById(world: WorldStorage, action_id: felt252) -> Action {
    let action: Action = world.read_model(action_id);
    action
}

pub fn getObjectActions(world: WorldStorage, object_id: felt252) -> Array<Action> {
    let object: Object = world.read_model(object_id);
    let mut actions: Array<Action> = array![];
    for actionId in object.objectActionIds {
        let action = getActionById(world, actionId);
        actions.append(action);
    };
    actions
}

pub fn getObjectActionOfType(
    world: WorldStorage, object_id: felt252, action_type: ActionType,
) -> Action {
    let actions = getObjectActions(world, object_id);
    let mut foundActionId = 0;
    for action in actions {
        if action.actionType == action_type {
            foundActionId = action.actionId;
            break;
        }
    };
    getActionById(world, foundActionId)
}

pub fn getPlayer(mut world_store: WorldStorage, player_id: felt252) -> Player {
    let address_player = get_caller_address();
    let player_id: felt252 = address_player.into();
    let mut player: Player = world_store.read_model(player_id);
    player
}

pub fn doesPlayerExist(mut world_store: WorldStorage, player_id: felt252) -> bool {
    let mut player: Player = getPlayer(world_store, player_id);
    if (player.location == 0) {
        return false;
    }
    true
}

pub fn createPlayer(mut world_store: WorldStorage, player_id: felt252) -> Player {
    let address_player = get_caller_address();
    let start_room = 7892581999139148;
    let mut new_player = Player {
        player_id: player_id,
        player_adr: address_player,
        location: start_room,
        inventory: player_id,
    };
    let inv = Inventory { owner_id: player_id, items: array![] };
    new_player.move_to_room(world_store, start_room);
    world_store.write_model(@inv);
    world_store.write_model(@new_player);
    playerSay(world_store, player_id, "You feel light in the head");
    new_player
}

pub fn playerSay(mut world_store: WorldStorage, player_id: felt252, text: ByteArray) {
    world_store.write_model(@Output { playerId: player_id, text_o_vision: text });
}

pub fn initialize_caller(mut world_store: WorldStorage) -> Player {
    let player_id: felt252 = get_caller_address().into();
    if (doesPlayerExist(world_store, player_id) == false) {
        createPlayer(world_store, player_id);
    }
    let mut player = getPlayer(world_store, player_id);
    player
}
