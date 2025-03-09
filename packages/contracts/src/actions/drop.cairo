pub mod drop {
    use the_oruggin_trail::systems::tokeniser::{confessor::Garble};
    use dojo::world::{WorldStorage};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::models::{
        player::Player, room::Room, zrk_enums::{ObjectType}, object, object::Object,
        inventory::Inventory,
    };

    pub fn action_drop(mut world: WorldStorage, message: Garble, player: Player) -> ByteArray {
        println!("drop------->{:?}", message);
        let mut out: ByteArray = "";
        if message.dobj == ObjectType::None && message.matchedObject == 0 {
            // let item_desc: ByteArray = object_type_to_str(message.dobj);
            out = "Can't drop that";
        } else {
            let mut room: Room = world.read_model(player.location.clone());
            let mut inventory: Inventory = world.read_model(player.inventory.clone());
            let mut updated_inventory: Array<felt252> =
                array![]; // New inventory without the dropped item
            let mut found: bool = false;
            println!("inventory items {:?}", inventory.items.len());
            for element in inventory.items {
                let foundObject: Object = world.read_model(element);
                println!("{:?}", foundObject.objType);
                if (foundObject.objType == message.dobj
                    || foundObject.objectId == message.matchedObject)
                    && !found {
                    println!("dropping thing");
                    room.objectIds.append(foundObject.objectId);
                    let item_desc: ByteArray = object::getModelName(foundObject);
                    out =
                        format!(
                            "{} is dropped from your trusty plastic adventurers bag", item_desc,
                        );
                    found = true;
                } else {
                    updated_inventory.append(element);
                }
            };

            if !found {
                out = "Don't have one of those to drop.";
            }

            inventory.items = updated_inventory; // Update inventory
            world.write_model(@room);
            world.write_model(@inventory);
        }
        return out;
    }
}
