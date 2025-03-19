use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};
use the_oruggin_trail::models::{};
use the_oruggin_trail::components::{inventoryItem::InventoryItem};
// Container component
#[derive(Clone, Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Container {
    #[key]
    pub inst: felt252,
    pub is_container: bool,
    // properties
    pub can_be_opened: bool,
    pub can_receive_items: bool,
    pub is_open: bool,
    pub num_slots: u32,
    pub item_ids: Array<felt252>,
    pub action_map: Array<ByteArray>,
}

#[generate_trait]
pub impl ContainerImpl of ContainerTrait {
    fn is_container(self: Container) -> bool {
        self.is_container
    }

    fn get_item_ids(self: Container) -> Array<felt252> {
        self.item_ids
    }

    fn set_open(self: Container, mut world: WorldStorage, opened: bool) {
        let mut model: Container = world.read_model(self);
        model.is_open = opened;
        world.write_model(@model);
    }

    fn set_can_be_opened(self: Container, mut world: WorldStorage, can_be_opened: bool) {
        let mut model: Container = world.read_model(self);
        model.can_be_opened = can_be_opened;
        world.write_model(@model);
    }

    fn set_can_receive_items(self: Container, mut world: WorldStorage, can_receive_items: bool) {
        let mut model: Container = world.read_model(self);
        model.can_receive_items = can_receive_items;
        world.write_model(@model);
    }

    fn is_full(self: Container) -> bool {
        let itemAmount: u32 = self.item_ids.len().try_into().unwrap();
        return itemAmount >= self.num_slots;
    }

    fn is_empty(self: Container) -> bool {
        return self.item_ids.len() == 0;
    }

    fn can_put_item(self: Container, world: WorldStorage, item: InventoryItem) -> bool {
        let itemAmount: u32 = self.item_ids.len().try_into().unwrap();
        return itemAmount < self.num_slots;
    }

    fn put_item(self: Container, world: WorldStorage, item: InventoryItem) {
        assert(true == false, 'put_item not yet implemented');
    }


    fn take_item(self: Container, world: WorldStorage, item: InventoryItem) {
        assert(true == false, 'take_item not yet implemented');
    }
}
