use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};
use the_oruggin_trail::models::{object::Object, object::ObjectTrait};
#[derive(Clone, Drop, Serde, Introspect)]
#[dojo::model]
pub struct Inventory {
    #[key]
    pub owner_id: felt252,
    pub items: Array<felt252>,
}

#[generate_trait]
pub impl InventoryImpl of InventoryTrait {
    fn get_items(self: Inventory, world: WorldStorage) -> Array<Object> {
        let mut out: Array<Object> = array![];
        for i in self.items {
            let obj: Object = world.read_model(i);
            if obj.clone().is_object() {
                out.append(obj);
            }
        };
        return out;
    }
}
