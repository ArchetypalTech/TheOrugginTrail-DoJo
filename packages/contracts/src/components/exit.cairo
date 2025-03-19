use dojo::world::{WorldStorage};
use the_oruggin_trail::models::{player::Player, player::PlayerTrait, zrk_enums::DirectionType};

// Exit component
// An exit component allows the player to 'go' from one room to another
#[derive(Clone, Drop, Serde)]
#[dojo::model]
pub struct Exit {
    #[key]
    pub inst: felt252,
    pub is_exit: bool,
    // properties
    pub is_enterable: bool,
    pub leads_to: felt252,
    pub direction_type: DirectionType,
    pub action_map: Array<ByteArray>,
}

#[generate_trait]
pub impl ExitImpl of ExitTrait {
    fn is_exit(self: Exit) -> bool {
        self.is_exit
    }

    fn get_action_map(self: Exit) -> Array<ByteArray> {
        self.action_map
    }

    fn can_player_enter(self: Exit) -> bool {
        self.is_enterable
    }

    fn do_player_exit(
        self: Exit, mut world: WorldStorage, player: Player,
    ) { // move the player to the room this leads to
        // check if this exit is enabled
        // check if that room exists
        // check if play is already in that room
        player.move_to_room(world, self.leads_to);
    }
}

#[cfg(test)]
mod tests {
    use dojo::model::{ModelStorageTest};
    use super::{Exit, ExitTrait};
    use the_oruggin_trail::models::zrk_enums::DirectionType;
    use the_oruggin_trail::tests::test_world::test_world;

    #[test]
    fn test_is_exit() {
        let exit = Exit {
            inst: 1,
            is_exit: true,
            is_enterable: true,
            leads_to: 2,
            action_map: array!["enter", "go", "open"],
            direction_type: DirectionType::None,
        };
        assert(exit.is_exit(), 'is_exit should be true');
    }

    #[test]
    fn test_do_player_exit() {
        let mut world = test_world::create_test_environment();
        let (player, room, _, _, _, _) = test_world::setup_test_data(world);
        let mut exit = Exit {
            inst: room.roomId,
            is_exit: true,
            is_enterable: true,
            leads_to: room.roomId,
            action_map: array!["enter", "go", "open"],
            direction_type: DirectionType::None,
        };
        world.write_model_test(@exit);
        exit.do_player_exit(world, player);
        world.write_model_test(@player);
        assert(player.location == room.roomId, 'player should be in room 2');
    }
}
