
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

#[cfg(test)]
mod tests {
    use dojo::model::{ModelStorage, ModelStorageTest};
    use core::clone::Clone;
    use core::array::ArrayTrait;
    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait, WorldStorageTrait, WorldStorage};
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
    fn test_spawn_basement_room_properties() {
        // room should contain 0 objects
        // room should contain 0 players
        // room should have 2 exit
        // room should have 1 textdef
        let sys: Systems = test_rig::setup_world();
        let sut: ISpawnerDispatcher = sys.spawner;
        sut.setup();

        let room_name: ByteArray = "Eli's Basement";
        let basement_id: felt252 = p_hash::str_hash(@room_name);

        let basement: Room = sys.world.read_model(basement_id);

        // assert on the plain properties
        // type
        assert_eq!(
            basement.roomType,
            RoomType::Basement,
            "got {:?}, expected {:?}",
            basement.roomType,
            RoomType::Basement
        );
        // name
        let expected_name: ByteArray = "Eli's Basement";
        let actual = basement.shortTxt.clone();
        assert_eq!(actual, 
            expected_name, 
            "got {:?}, expected {:?}", 
            basement.shortTxt, 
            expected_name);

        // description
        let txtid = basement.txtDefId;
        let txt: Txtdef = sys.world.read_model(txtid);
        let actual_desc = txt.text.clone();
        let expected_desc: ByteArray = 
                "the basement is a converted root cellar, with a small stool bolted to the floor\nit is not a comforting room and reminds you of far to many movies that you probably never should have watched\nthe light is just enough that you don't have to see too much.\nit smells damp and somehow of bad faith.";

        assert_eq!(actual_desc, 
            expected_desc, 
            "got {:?}, expected {:?}", 
            txt.text, 
            expected_desc);
        
        let actual_owner = txt.owner;
        let expected_owner = basement_id.clone();

        // owner should be the pass id
        assert_eq!(
            actual_owner, 
            expected_owner, 
            "got {:?}, expected {:?}", 
            txt.owner, 
            expected_owner
        );

        // check the rooms exits
        // there should be 1 exits
        let exits: Array<felt252> = basement.dirObjIds.clone();
        assert_eq!(exits.len(), 1, "got {:?}, expected {:?}", exits.len(), 1);

        // check the objects and players
        // object ids should contain 1 item
        let objects: Array<felt252> = basement.objectIds.clone();
        assert_eq!(
            objects.len(), 1, 
            "got {:?}, expected {:?}", 
            objects.len(), 1);
            
        // check dynamite
        let dynamite_id = objects.at(0).clone();
        let dynamite: Object = sys.world.read_model(dynamite_id);
        
        assert_eq!(
            dynamite.matType, MaterialType::TNT, 
            "got {:?}, expected {:?}", 
            dynamite.matType, MaterialType::TNT);

        assert_eq!(dynamite.objType, ObjectType::Dynamite, 
            "got {:?}, expected {:?}", 
            dynamite.objType, 
            ObjectType::Dynamite);

        let txtid = dynamite.txtDefId;
        let txtdef: Txtdef = sys.world.read_model(txtid);
        let txt: ByteArray = txtdef.text.clone();
        let expected: ByteArray = "a stick of slightly sweaty dynamite almost like a caricature of itself. It's fused and certainly unstable and capable of turning things including you into a fine meaty mist still holding exciteable explosives couldn't hurt right?";
        assert_eq!(txt, expected, "got {:?}, expected {:?}", txt, expected);
        
        // dynamite actions
        let action_ids = dynamite.objectActionIds.clone();
        assert_eq!(action_ids.len(), 2,
             "got {:?}, expected {:?}", 
            action_ids.len(), 2);

        let dynamite_action_id = action_ids.at(0).clone();
        let dynamite_action: Action = sys.world.read_model(dynamite_action_id);

        assert_eq!(dynamite_action.actionType, ActionType::Explode, 
            "got {:?}, expected {:?}", 
            dynamite_action.actionType, ActionType::Explode);
        assert_eq!(dynamite_action.dBit, false, 
            "got {:?}, expected {:?}", 
            dynamite_action.dBit, false);
        assert_eq!(dynamite_action.enabled, false, 
            "got {:?}, expected {:?}", 
            dynamite_action.enabled, false);
        assert_eq!(dynamite_action.revertable, false, 
            "got {:?}, expected {:?}", 
            dynamite_action.revertable, false);
        assert_eq!(dynamite_action.affectsActionId, 0, 
            "got {:?}, expected {:?}", 
            dynamite_action.affectsActionId, 0);
        assert_eq!(dynamite_action.affectedByActionId, 391013870899427591631360373114847453203618537489112164684713797481411886640, 
            "got {:?}, expected {:?}", 
            dynamite_action.affectedByActionId, 391013870899427591631360373114847453203618537489112164684713797481411886640);

        let dynamite_action_id2 = action_ids.at(1).clone();
        let dynamite_action2: Action = sys.world.read_model(dynamite_action_id2);
        assert_eq!(dynamite_action2.actionType, ActionType::Ignite, 
            "got {:?}, expected {:?}", 
            dynamite_action2.actionType, ActionType::Ignite);
        assert_eq!(dynamite_action2.dBit, false, 
            "got {:?}, expected {:?}", 
            dynamite_action2.dBit, false);
        assert_eq!(dynamite_action2.enabled, true, 
            "got {:?}, expected {:?}", 
            dynamite_action2.enabled, true);
        assert_eq!(dynamite_action2.revertable, false, 
            "got {:?}, expected {:?}", 
            dynamite_action2.revertable, false);
        assert_eq!(dynamite_action2.affectsActionId, 1000696570478405365665486888702104758142241848859272025347907870684247880756, 
            "got {:?}, expected {:?}", 
            dynamite_action2.affectsActionId, 1000696570478405365665486888702104758142241848859272025347907870684247880756);
        assert_eq!(dynamite_action2.affectedByActionId, 0, 
            "got {:?}, expected {:?}", 
            dynamite_action2.affectedByActionId, 0);

        let players: Array<felt252> = basement.players.clone();
        assert_eq!(players.len(), 0, "got {:?}, expected {:?}", players.len(), 0);
    }

    #[test]
    #[available_gas(600000000)]
    fn test_spawn_basement_exit_properties () {
        // room should have:
        // 1 exit
        // exit E should have:
        // 1 action
        // 1 action should be:
        // open
        // revertable
        // dBit
        // enabled
        // affectsActionId 0
        // affectedByActionId 0
        let sys: Systems = test_rig::setup_world();
        let sut: ISpawnerDispatcher = sys.spawner;
        sut.setup();


        let room_name: ByteArray = "Eli's Basement";
        let basement_id: felt252 = p_hash::str_hash(@room_name);

        let basement: Room = sys.world.read_model(basement_id);

        // room should have 1 exits 
        let exits: Array<felt252> = basement.dirObjIds.clone();
        assert_eq!(exits.len(), 1, "got {:?}, expected {:?}", exits.len(), 1);
        
        // exit UP
        let exit_u_id = exits.at(0).clone();
        let exit_u: Object = sys.world.read_model(exit_u_id);
        
        // assert that
        // exit UP is a STAIR
        assert_eq!(exit_u.objType, ObjectType::Stairs, "got {:?}, expected {:?}", exit_u.objType, ObjectType::Stairs);
        // exit UP destination should be:
        // Eli's Barn
        // ids match
        let dest_u_name = "Eli's Barn";
        let dest_u_id = p_hash::str_hash(@dest_u_name);
        assert_eq!(exit_u.destId, dest_u_id, "got {:?}, expected {:?}", exit_u.destId, dest_u_id);
        // description matches
        let txt_id = exit_u.txtDefId;
        let txt: Txtdef = sys.world.read_model(txt_id);
        let _desc = txt.text.clone();
        let _desc_expected = "a slightly charcoaled wooden set of stairs lead upwards";

        assert_eq!(_desc, _desc_expected, "got {:?}, expected {:?}", _desc, _desc_expected);
        // exit WEST should be a window
        assert_eq!(exit_u.objType, ObjectType::Stairs, "got {:?}, expected {:?}", exit_u.objType, ObjectType::Stairs);
        // exit direction should be:
        // East
        assert_eq!(exit_u.dirType, DirectionType::Up, "got {:?}, expected {:?}", exit_u.dirType, DirectionType::Up);
        // exit material should be:
        // Glass
        assert_eq!(exit_u.matType, MaterialType::Wood, "got {:?}, expected {:?}", exit_u.matType, MaterialType::Wood);
        // action
        // 1 actions
        let actions: Array<felt252> = exit_u.objectActionIds.clone();
        assert_eq!(actions.len(), 1, "got {:?}, expected {:?}", actions.len(), 1);

       let open_action_id = actions.at(0).clone();
       let open_action: Action = sys.world.read_model(open_action_id);

        // action 1 should be:
        // open
       assert_eq!(open_action.actionType, ActionType::Open, "got {:?}, expected {:?}", open_action.actionType, ActionType::Open);
       // !revertable
       assert_eq!(open_action.revertable, false, "got {:?}, expected {:?}", open_action.revertable, false);
       // dBit
       assert_eq!(open_action.dBit, true, "got {:?}, expected {:?}", open_action.dBit, true);
       // enabled
       assert_eq!(open_action.enabled, true, "got {:?}, expected {:?}", open_action.enabled, true);
       // affectsActionId 
       assert_eq!(open_action.affectsActionId, 0, "got {:?}, expected {:?}", open_action.affectsActionId, 0);

    }
}
