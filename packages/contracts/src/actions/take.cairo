pub mod take {
    use the_oruggin_trail::systems::tokeniser::{lexer::Garble};
    use dojo::world::{WorldStorage};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::lib::world;
    use the_oruggin_trail::models::{player::Player, room::Room, zrk_enums::{ObjectType}, object};

    pub fn action_take(mut world: WorldStorage, message: Garble, player: Player) -> ByteArray {
        println!("take------->{:?}", message);
        let mut out: ByteArray = "";
        if message.dobj == ObjectType::None && message.matchedObject == 0 {
            // let item_desc: ByteArray = object_type_to_str(message.dobj);
            out = "I can't take that";
        } else {
            let mut new_obj_ids: Array<felt252> = array![];
            let mut room: Room = world.read_model(player.location.clone());
            let objects = world::getRoomObjects(world, room.clone());
            let mut inventory = world::getPlayerInventory(world, player);
            for obj in objects {
                println!("{:?}", obj.objType);
                if obj.objType == message.dobj || obj.objectId == message.matchedObject {
                    println!("found thing");
                    inventory.items.append(obj.objectId);
                    let item_desc: ByteArray = object::getObjectName(obj);
                    out = format!("{} is now in your trusty plastic adventurers bag", item_desc);
                } else {
                    new_obj_ids.append(obj.objectId);
                }
            };

            room.objectIds = new_obj_ids;
            world.write_model(@room);
            world.write_model(@inventory);
        }
        return out;
    }
}
