use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};
use the_oruggin_trail::models::{
    player::Player, room::Room, object, object::Object, inventory::Inventory, txtdef::Txtdef,
    action::Action, zrk_enums::{ActionType},
};

pub fn getRoomObjects(world: WorldStorage, room: Room) -> Array<Object> {
    let mut objects: Array<Object> = array![];
    for objectId in room.objectIds {
        let object: Object = world.read_model(objectId);
        assert(object::doesObjectExist(object.clone()), 'Invalid roomObj');
        objects.append(object);
    };
    objects
}

pub fn getPlayerInventoryObjects(world: WorldStorage, player: Player) -> Array<Object> {
    let mut objects: Array<Object> = array![];
    let mut inventory: Inventory = world.read_model(player.inventory.clone());
    for objectId in inventory.items {
        let object: Object = world.read_model(objectId);
        assert(object::doesObjectExist(object.clone()), 'Invalid invObj');
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
