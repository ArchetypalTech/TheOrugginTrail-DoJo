
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

#[cfg(test)]
mod tests {
     use core::clone::Clone;
    use core::array::ArrayTrait;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::utils::test::{deploy_contract, spawn_test_world};

    use the_oruggin_trail::lib::hash_utils::hashutils as h_util;

    use the_oruggin_trail::systems::{
        meatpuppet::{meatpuppet, IListenerDispatcher, IListenerDispatcherTrait},
        spawner::{spawner, ISpawnerDispatcher, ISpawnerDispatcherTrait}
    };

    use the_oruggin_trail::{
        constants::zrk_constants::{roomid as rm, roomid_to_str as rts},
        models::{
            txtdef::{Txtdef, txtdef}, room::{Room, room},
            action::{Action, action},
            object::{Object, object, ball_mock_hash},
            output::{Output, output},
            player::{Player, player},
            inventory::{Inventory, inventory},
            zrk_enums::{MaterialType, ActionType, ObjectType, DirectionType, RoomType}
        },
        lib::hash_utils::hashutils as p_hash
    };

    use the_oruggin_trail::tests::test_rig::{
        test_rig,
        test_rig::{Systems, ZERO, OWNER, OTHER}
    };
    

    /// Handling for Act
    /// 
    /// test the default action for a kick on a ball
    /// it should be triggered by not passing a dobj into a command
    #[test]
    #[available_gas(200000000)]
    fn test_act_kick_ball_default_action() {
        let sys: Systems = test_rig::setup_world();
        let pid: felt252 = 23;

        let rm_name: ByteArray = rts(rm::BARN);
        let rm_id = h_util::str_hash(@rm_name);

        let sp: ISpawnerDispatcher = sys.spawner;
        sp.setup();
        sp.spawn_player(23, rm_id);
        
        let mut pl: Player = get!(sys.world, 23, (Player));
        pl.inventory = 23;
        let ball_id = ball_mock_hash();
        let items = array![ball_id];

        let mut inv: Inventory = Inventory{owner_id: 23, items: items};
        set!(sys.world, (pl));
        set!(sys.world, (inv));

        let mp: IListenerDispatcher = sys.listener;

        let input: Array<ByteArray> = array!["kick", "ball"];
        mp.listen(input, pid);

        let expected_desc: ByteArray = "the ball bounces feebly and rolls into some dog shit. fun.";

        let output = get!(sys.world, 23, (Output));
        let actual = output.text_o_vision;
        assert_eq!(expected_desc, actual, "Expected {:?} got {:?}", expected_desc, actual);
    }

    /// kick ball at a window
    /// 
    /// should break the window
    /// 
    #[test]
    #[available_gas(200000000)]
    fn test_act_kick_ball_at_window() {
        let sys: Systems = test_rig::setup_world();
        let pid: felt252 = 23;

        let rm_name: ByteArray = rts(rm::PASS);
        let rm_id = h_util::str_hash(@rm_name);

        let expected_rm_name: ByteArray = rts(rm::PASS);
        let expected_rm_id = h_util::str_hash(@expected_rm_name);

        let sp: ISpawnerDispatcher = sys.spawner;
        sp.setup();
        sp.spawn_player(23, rm_id);

        let mp: IListenerDispatcher = sys.listener;

        let input: Array<ByteArray> = array!["go", "east"];
        mp.listen(input, pid);

        let expected_desc: ByteArray = "no. you cannot go that way.\n\"reasons\" mumbles shoggoth into his hat\n she seems to be waving a hand shaped thing";

        let output = get!(sys.world, 23, (Output));
        let actual = output.text_o_vision;
        assert_eq!(expected_desc, actual, "Expected {:?} got {:?}", expected_desc, actual);

        let pl: Player = get!(sys.world, 23, (Player));
        let curr_rm_id = pl.location.clone();
        assert_eq!(expected_rm_id, curr_rm_id, "Expected {:?} got {:?}", expected_rm_id, curr_rm_id );
    }
    
}
