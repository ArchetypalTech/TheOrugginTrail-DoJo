#[cfg(test)]
mod tests {
     use core::clone::Clone;
    use core::array::ArrayTrait;
    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    // import test utils
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
            object::{Object, object},
            output::{Output, output},
            zrk_enums::{MaterialType, ActionType, ObjectType, DirectionType, RoomType}
        },
        lib::hash_utils::hashutils as p_hash
    };

    use the_oruggin_trail::tests::test_rig::{
        test_rig,
        test_rig::{Systems, ZERO, OWNER, OTHER}
    };
    

    /// Handling for Look
    /// 
    /// We want to see that the correct string hand been generated for
    /// cmds of the LOOK type. i.e. `LOOK AROUND` | `LOOK` wil generate a
    /// description string composed from the Object graph
    #[test]
    #[available_gas(200000000)]
    fn test_look_around() {
        // let caller = starknet::contract_address_const::<0x0>();
        let sys: Systems = test_rig::setup_world();
        let spawn: ISpawnerDispatcher = sys.spawner;
        let pid: felt252 = 23;
        spawn.setup();

        let rm_name: ByteArray = rts(rm::PASS);
        let rm_id = h_util::str_hash(@rm_name);
        spawn.spawn_player(pid, rm_id);

        let rm = get!(sys.world, rm_id, (Room));
        let expected_txt: ByteArray = "walking eagle pass";
        assert_eq!(rm.shortTxt.clone(), expected_txt.clone(), "Expected {:?} got {:?}", rm.shortTxt, expected_txt);

        

        let mp: IListenerDispatcher = sys.listener;

        let input: Array<ByteArray> = array!["look", "around"];
        mp.listen(input, pid);
        let expected: ByteArray = "walking eagle pass\nYou are standing on a pass in the mountains";
        let output = get!(sys.world, 23, (Output));
        let actual = output.text_o_vision;
        assert_eq!(expected, actual, "Expected {:?} got {:?}", expected, actual);
    }
    /// Generate the short description of the room
    /// 
    /// this is composed of the room type and biome and name/shortTxt
    /// it gives a general description text without parsing the objects etc into the text
    #[test]
    #[available_gas(200000000)]
    fn test_look_short() {
        let sys: Systems = test_rig::setup_world();
        let spawn: ISpawnerDispatcher = sys.spawner;
        let pid: felt252 = 23;
        spawn.setup();
        
    }

    ///test that meatpuppet can call spawner
    #[test]
    fn test_spawner_from_mp() {

    }
    
}