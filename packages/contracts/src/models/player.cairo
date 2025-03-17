use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};

use starknet::ContractAddress;

/// Player model
#[derive(Copy, Drop, Serde, Debug, Introspect)]
#[dojo::model]
pub struct Player {
    #[key]
    pub player_id: felt252,
    pub player_adr: ContractAddress,
    pub location: felt252,
    pub inventory: felt252,
}

#[generate_trait]
pub impl PlayerImpl of PlayerTrait {
    fn move_to_room(mut self: Player, mut world: WorldStorage, room_id: felt252) {
        self.location = room_id;
        world.write_model(@self);
    }
}
