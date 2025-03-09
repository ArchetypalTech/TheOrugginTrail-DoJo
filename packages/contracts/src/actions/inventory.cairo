pub mod inventory {
    use the_oruggin_trail::systems::tokeniser::{confessor::Garble};
    use dojo::world::{WorldStorage};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::models::{
        player::Player, room::Room, zrk_enums::{ObjectType, object_type_to_str}, object::Object,
        object, inventory::Inventory,
    };

    pub fn action_inventory_list(
        mut world: WorldStorage, message: Garble, player: Player,
    ) -> ByteArray {
        println!("action------->{:?}", message);
        let mut out: ByteArray = "You are carrying:";
        let mut inventory: Inventory = world.read_model(player.inventory.clone());
        let mut found: bool = false;
        for element in inventory.items {
            let foundObject: Object = world.read_model(element);
            if foundObject.objectId != 0 {
                let item_desc: ByteArray = object::getModelName(foundObject);
                out = format!("{}\n- {}", out, item_desc);
                found = true;
            }
        };

        if !found {
            out = "You have nothing in your inventory.";
        }
        return out;
    }
}
