use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};
use the_oruggin_trail::lib::world;
use the_oruggin_trail::models::{};

// Inspectable component
#[derive(Clone, Drop, Serde, Introspect)]
#[dojo::model]
pub struct Inspectable {
    #[key]
    pub inst: felt252,
    pub is_inspectable: bool,
    // properties
    pub is_visible: bool,
    pub text_id: felt252,
}

#[generate_trait]
pub impl InspectableImpl of InspectableTrait {
    fn is_inspectable(self: Inspectable) -> bool {
        self.is_inspectable
    }

    fn look_at(self: Inspectable, world: WorldStorage) -> ByteArray {
        world::getTextById(world, self.text_id)
    }

    fn set_visible(self: Inspectable, mut world: WorldStorage, visible: bool) {
        let mut model: Inspectable = world.read_model(self);
        model.is_visible = visible;
        world.write_model(@model);
    }
}
