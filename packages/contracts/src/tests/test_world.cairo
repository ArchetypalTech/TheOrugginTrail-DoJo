
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;
    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    // import test utils
    use dojo::test_utils::{spawn_test_world, deploy_contract};
    // import test utils
    use the_oruggin_trail::{
        systems::{
            actions::{actions, IActionsDispatcher, IActionsDispatcherTrait},
            outputter::{outputter, IOutputterDispatcher, IOutputterDispatcherTrait},
        },
        models::{
            position::{Position, Vec2, position}, moves::{Moves, Direction, moves},
            zrk_enums::{MaterialType, ActionType}, output::{Output, output}
        }
    };

    #[test]
    #[available_gas(30000000)]
    fn test_types() {
        let wood_desc: felt252 = MaterialType::Wood.into();
        assert(wood_desc == 'wood', 'Wrong type');
    }

    #[test]
    #[available_gas(30000000)]
    fn test_outputter() {
        let player_id = 23;
        let mut models = array![output::TEST_CLASS_HASH];
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract(
                'salt', outputter::TEST_CLASS_HASH.try_into().unwrap(), array![].span()
            );
        let output_system = IOutputterDispatcher { contract_address };
        output_system.updateOutput("FOOBAR!");

        let _out = get!(world, player_id, Output);
        let actual_out = _out.text_o_vision;
        let expected_out: ByteArray = "FOOBAR!";
        assert_eq!(actual_out, expected_out, "expected {:?}, got {:?}", expected_out, actual_out);
    }

    #[test]
    #[available_gas(30000000)]
    fn test_move() {
        // caller
        let caller = starknet::contract_address_const::<0x0>();

        // models
        let mut models = array![position::TEST_CLASS_HASH, moves::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap(), array![].span());
        let actions_system = IActionsDispatcher { contract_address };

        // call spawn()
        actions_system.spawn();

        // call move with direction right
        actions_system.move(Direction::Right);

        // Check world state
        let moves = get!(world, caller, Moves);

        // casting right direction
        let right_dir_felt: felt252 = Direction::Right.into();

        // check moves
        assert(moves.remaining == 99, 'moves is wrong');

        // check last direction
        assert(moves.last_direction.into() == right_dir_felt, 'last direction is wrong');

        // get new_position
        let new_position = get!(world, caller, Position);

        // check new position x
        assert(new_position.vec.x == 11, 'position x is wrong');

        // check new position y
        assert(new_position.vec.y == 10, 'position y is wrong');
    }
}
