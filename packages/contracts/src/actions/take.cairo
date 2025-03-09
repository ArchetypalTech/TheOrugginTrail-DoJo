pub mod take {
    use the_oruggin_trail::systems::tokeniser::{confessor::Garble};
    use dojo::world::{WorldStorage};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::models::{
        player::Player, room::Room, zrk_enums::{ObjectType}, object, object::Object,
        inventory::Inventory,
    };

    pub fn action_take(mut world: WorldStorage, message: Garble, player: Player) -> ByteArray {
        println!("take------->{:?}", message);
        let mut out: ByteArray = "";
        if message.dobj == ObjectType::None {
            // let item_desc: ByteArray = object_type_to_str(message.dobj);
            out = "I can't take that";
        } else {
            let mut room: Room = world.read_model(player.location.clone());
            let mut obj_ids: Array<felt252> = room.objectIds.clone();
            let mut new_obj_ids: Array<felt252> = array![];
            let mut inventory: Inventory = world.read_model(player.inventory.clone());
            // let mut found: bool = false;
            println!("objs {:?}", obj_ids.len());
            for element in obj_ids {
                let obj: Object = world.read_model(element);
                println!("{:?}", obj.objType);
                if obj.objType == message.dobj {
                    // found = true;
                    println!("found thing");
                    inventory.items.append(obj.objectId);
                    let item_desc: ByteArray = object::getModelName(obj);
                    out = format!("{} is now in your trusty plastic adventurers bag", item_desc);
                } else {
                    new_obj_ids.append(element);
                }
            };

            room.objectIds = new_obj_ids;
            world.write_model(@room);
            world.write_model(@inventory);
        }
        return out;
    }
}
