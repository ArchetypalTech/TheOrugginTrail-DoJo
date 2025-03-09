use the_oruggin_trail::systems::tokeniser::{confessor::Garble};
use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};
use the_oruggin_trail::models::{
    player, player::Player, room, room::Room, object, object::Object, inventory::Inventory,
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
