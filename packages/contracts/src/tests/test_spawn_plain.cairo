
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

#[cfg(test)]
mod tests {
    use core::clone::Clone;
    use core::array::ArrayTrait;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait, WorldStorage, WorldStorageTrait};

    // import test utils

    use the_oruggin_trail::{
        systems::{spawner::{spawner, ISpawnerDispatcher, ISpawnerDispatcherTrait}},
        constants::zrk_constants::roomid as rm,
        models::{
            txtdef::{Txtdef, m_Txtdef}, room::{Room, m_Room},
            action::{Action, m_Action, action_mock_hash as act_phash},
            object::{Object, m_Object, obj_mock_hash as obj_phash},
            zrk_enums::{MaterialType, ActionType, ObjectType, DirectionType, RoomType}
        },
        lib::hash_utils::hashutils as p_hash
    };

    use the_oruggin_trail::tests::test_rig::{
        test_rig,
        test_rig::{Systems, ZERO, OWNER, OTHER}
    };


    #[test]
    #[available_gas(600000000)]
    fn test_spawn_plain_room_properties() {
        // room should contain 1 objects
        // object should be a ball
        // ball should have 1 action
        // ball action should be kick
        // ball action should have dBitTxt  
        // room should contain 0 players
        // room should have 2 exit
        // room should have 1 textdef
        let sys: Systems = test_rig::setup_world();
        let sut: ISpawnerDispatcher = sys.spawner;
        sut.setup();

        let room_name: ByteArray = "Bensons Plain";
        let plain_id: felt252 = p_hash::str_hash(@room_name);

        let plain: Room = sys.world.read_model(plain_id);

        // assert on the plain properties
        // type
        assert_eq!(
            plain.roomType,
            RoomType::Plain,
            "got {:?}, expected {:?}",
            plain.roomType,
            RoomType::Plain
        );
        // name
        let expected_name: ByteArray = "Bensons Plain";
        let actual = plain.shortTxt.clone();
        assert_eq!(actual, expected_name, "got {:?}, expected {:?}", plain.shortTxt, expected_name);

        // description
        let txtid = plain.txtDefId;
        let txt: Txtdef = sys.world.read_model(txtid);
        let actual_desc = txt.text.clone();
        let expected_desc: ByteArray = 
                "the plain reaches seemingly endlessly to the sky in all directions\nand the sky itself feels greasy and cold.\npyramidal rough shapes dot the horizin and land which\nupon closer examination are made from bufalo skulls.\nThe air tastes of grease and bensons.\nhappy happy happy";
        assert_eq!(actual_desc, expected_desc, "got {:?}, expected {:?}", txt.text, expected_desc);
        
        let actual_owner = txt.owner;
        let expected_owner = plain_id.clone();

        // owner should be the pass id
        assert_eq!(
            actual_owner, expected_owner, "got {:?}, expected {:?}", txt.owner, expected_owner
        );

        // check the objects and players
        // object ids should contain 1 item
        let objects: Array<felt252> = plain.objectIds.clone();
        assert_eq!(objects.len(), 1, "got {:?}, expected {:?}", objects.len(), 1);

        // objects should be
        // a ball
        // kickable
        // *****
        // description
        let ball: Object = sys.world.read_model(objects.at(0).clone());
        let actual_desc_id = ball.txtDefId;
        let actual_desc: Txtdef = sys.world.read_model(actual_desc_id);
        let actual_text = actual_desc.text.clone();
        let expected_desc: ByteArray = 
                "a knock off UEFA football\nits a bit battered and bruised\nnot exactly a sphere\nbut you can kick it";
        assert_eq!(actual_text, expected_desc, "got {:?}, expected {:?}", actual_text, expected_desc);

        // ball action
        let actions: Array<felt252> = ball.objectActionIds.clone();
        assert_eq!(actions.len(), 1, "got {:?}, expected {:?}", actions.len(), 1);
        let action_id = actions.at(0).clone();
        let action: Action = sys.world.read_model(action_id);
        assert_eq!(action.actionType, ActionType::Kick, "got {:?}, expected {:?}", action.actionType, ActionType::Kick);
        // action.dBit should be true
        assert_eq!(action.dBit, true, "got {:?}, expected {:?}", action.dBit, true);
        // action.enabled should be true
        assert_eq!(action.enabled, true, "got {:?}, expected {:?}", action.enabled, true);
        // action.revertable should be false
        assert_eq!(action.revertable, false, "got {:?}, expected {:?}", action.revertable, false);
        // action.affectsActionId should be 0
        assert_eq!(action.affectsActionId, 0, "got {:?}, expected {:?}", action.affectsActionId, 0);
        // action.affectedByActionId should be 0    
        assert_eq!(action.affectedByActionId, 0, "got {:?}, expected {:?}", action.affectedByActionId, 0);
        // action.dBitTxt should be "the ball bounces feebly and rolls into some dog shit. fun."
        let expected_dbit_txt: ByteArray = "the ball bounces feebly and rolls into some dog shit. fun.";
        let actual_dbit_txt = action.dBitTxt.clone();
        assert_eq!(actual_dbit_txt, expected_dbit_txt, "got {:?}, expected {:?}", actual_dbit_txt, expected_dbit_txt);

        // player ids should be empty
        let players: Array<felt252> = plain.players.clone();
        assert_eq!(players.len(), 0, "got {:?}, expected {:?}", players.len(), 0);

        // check the rooms exits
        // there should be 2 exits
        let exits: Array<felt252> = plain.dirObjIds.clone();
        assert_eq!(exits.len(), 2, "got {:?}, expected {:?}", exits.len(), 2);
    }

    #[test]
    #[available_gas(600000000)]
    fn test_spawn_plain_exit_properties () {
        // room should have:
        // 1 exit
        // exit should have:
        // 1 action
        // action should be:
        // open
        // revertable
        // dBit
        // enabled
        // affectsActionId 0
        // affectedByActionId 0
        let sys: Systems = test_rig::setup_world();
        let sut: ISpawnerDispatcher = sys.spawner;
        sut.setup();


        let room_name: ByteArray = "Bensons Plain";
        let plain_id: felt252 = p_hash::str_hash(@room_name);

        let plain: Room = sys.world.read_model(plain_id);

        // room should have 2 exits 
        let exits: Array<felt252> = plain.dirObjIds.clone();
        assert_eq!(exits.len(), 2, "got {:?}, expected {:?}", exits.len(), 2);
        
        // exit EAST
        let exit_e_id = exits.at(0).clone();
        let exit_e: Object = sys.world.read_model(exit_e_id);
        
        // assert that
        // exit EAST is a path
        assert_eq!(exit_e.objType, ObjectType::Path, "got {:?}, expected {:?}", exit_e.objType, ObjectType::Path);
        // exit EAST destination should be:
        // walking eagle pass
        // ids match
        let dest_e_name = "Walking Eagle Pass";
        let dest_e_id = p_hash::str_hash(@dest_e_name);
        assert_eq!(exit_e.destId, dest_e_id, "got {:?}, expected {:?}", exit_e.destId, dest_e_id);
        // description matches
        let txt_id = exit_e.txtDefId;
        let txt: Txtdef = sys.world.read_model(txt_id);
        let _desc = txt.text.clone();
        let _desc_expected = "a path east leads upwards toward the mountains";
        assert_eq!(_desc, _desc_expected, "got {:?}, expected {:?}", _desc, _desc_expected);
        // exit EAST should be a path
        assert_eq!(exit_e.objType, ObjectType::Path, "got {:?}, expected {:?}", exit_e.objType, ObjectType::Path);
        // exit direction should be:
        // East
        assert_eq!(exit_e.dirType, DirectionType::East, "got {:?}, expected {:?}", exit_e.dirType, DirectionType::East);
        // exit material should be:
        // Dirt
        assert_eq!(exit_e.matType, MaterialType::Dirt, "got {:?}, expected {:?}", exit_e.matType, MaterialType::Dirt);
        // action
        let actions: Array<felt252> = exit_e.objectActionIds.clone();
        assert_eq!(actions.len(), 1, "got {:?}, expected {:?}", actions.len(), 1);

       let action_id = actions.at(0).clone();
       let action: Action = sys.world.read_model(action_id);

        // action should be:
        // open
       assert_eq!(action.actionType, ActionType::Open, "got {:?}, expected {:?}", action.actionType, ActionType::Open);
       // !revertable
       assert_eq!(action.revertable, false, "got {:?}, expected {:?}", action.revertable, false);
       // dBit
       assert_eq!(action.dBit, true, "got {:?}, expected {:?}", action.dBit, true);
       // enabled
       assert_eq!(action.enabled, true, "got {:?}, expected {:?}", action.enabled, true);
       // affectsActionId 0
       assert_eq!(action.affectsActionId, 0, "got {:?}, expected {:?}", action.affectsActionId, 0);
       // affectedByActionId 0
       assert_eq!(action.affectedByActionId, 0, "got {:?}, expected {:?}", action.affectedByActionId, 0);

        // exit NORTH
        let exit_n_id = exits.at(1).clone();
        let exit_n: Object = sys.world.read_model(exit_n_id);
        
        // exit NORTH destination should be:
        // eli's barn
        // ids match
        let dest_name = "Eli's Barn";
        let dest_id = p_hash::str_hash(@dest_name);
        assert_eq!(exit_n.destId, dest_id, "got {:?}, expected {:?}", exit_n.destId, dest_id);
        // description matches
        let txt_id = exit_n.txtDefId;
        let txt: Txtdef = sys.world.read_model(txt_id);
        let _desc = txt.text.clone();
        let _desc_expected = "a path north leads toward a large wooden barn";
        assert_eq!(_desc, _desc_expected, "got {:?}, expected {:?}", _desc, _desc_expected);
        // exit NORTH should be a path
        assert_eq!(exit_n.objType, ObjectType::Path, "got {:?}, expected {:?}", exit_n.objType, ObjectType::Path);
        // exit direction should be:
        // North
        assert_eq!(exit_n.dirType, DirectionType::North, "got {:?}, expected {:?}", exit_n.dirType, DirectionType::North);
        // exit material should be:
        // Dirt
        assert_eq!(exit_n.matType, MaterialType::Dirt, "got {:?}, expected {:?}", exit_n.matType, MaterialType::Dirt);
        // 1 action
        let actions: Array<felt252> = exit_n.objectActionIds.clone();
        assert_eq!(actions.len(), 1, "got {:?}, expected {:?}", actions.len(), 1);

        let action_id = actions.at(0).clone();
        let action: Action = sys.world.read_model(action_id);

        // action should be:
        // open
        assert_eq!(action.actionType, ActionType::Open, "got {:?}, expected {:?}", action.actionType, ActionType::Open);
        // !revertable
        assert_eq!(action.revertable, false, "got {:?}, expected {:?}", action.revertable, false);
        // dBit
        assert_eq!(action.dBit, true, "got {:?}, expected {:?}", action.dBit, true);
        // enabled
        assert_eq!(action.enabled, true, "got {:?}, expected {:?}", action.enabled, true);
        // affectsActionId 0
        assert_eq!(action.affectsActionId, 0, "got {:?}, expected {:?}", action.affectsActionId, 0);
        // affectedByActionId 0
        assert_eq!(action.affectedByActionId, 0, "got {:?}, expected {:?}", action.affectedByActionId, 0);
    }
}
