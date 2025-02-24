
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

#[cfg(test)]
mod tests {
    use core::clone::Clone;
    use core::array::ArrayTrait;
    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    // import test utils

    use dojo::model::{ModelStorage, ModelStorageTest};

    use the_oruggin_trail::{
        systems::spawner::{spawner, ISpawnerDispatcher, ISpawnerDispatcherTrait},
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
    fn test_spawn_barn_room_properties() {
        // room should contain 1 haybale
        // room should contain 0 players
        // room should have 3 exits
        // room should have 1 textdef
        let sys: Systems = test_rig::setup_world();
        let sut: ISpawnerDispatcher = sys.spawner;
        sut.setup();

        let room_name: ByteArray = "Eli's Barn";
        let barn_id: felt252 = p_hash::str_hash(@room_name);
        let barn: Room = sys.world.read_model(barn_id);

        // assert on the plain properties
        // type
        assert_eq!(
            barn.roomType,
            RoomType::Barn,
            "got {:?}, expected {:?}",
            barn.roomType,
            RoomType::Barn
        );
        // name
        let expected_name: ByteArray = "Eli's Barn";
        let actual = barn.shortTxt.clone();
        assert_eq!(actual, expected_name, "got {:?}, expected {:?}", barn.shortTxt, expected_name);

        // description
        let txtid = barn.txtDefId;
        let txt: Txtdef = sys.world.read_model(txtid);
        let actual_desc = txt.text.clone();
        let expected_desc: ByteArray = 
                "the barn is old and smells of old hay and oddly dissolution\nthe floor is dirt and trampled dried horse shit scattered with straw and broken bottles\nthe smell is not unpleasent and reminds you faintly of petrol and old socks";
        assert_eq!(actual_desc, expected_desc, "got {:?}, expected {:?}", txt.text, expected_desc);
        
        let actual_owner = txt.owner;
        let expected_owner = barn_id.clone();

        // owner should be the pass id
        assert_eq!(
            actual_owner, expected_owner, "got {:?}, expected {:?}", txt.owner, expected_owner
        );

        // check the objects and players
        // object ids should contain 1 item
        let objects: Array<felt252> = barn.objectIds.clone();
        assert_eq!(objects.len(), 1, "got {:?}, expected {:?}", objects.len(), 0);

        // player ids should be empty
        let players: Array<felt252> = barn.players.clone();
        assert_eq!(players.len(), 0, "got {:?}, expected {:?}", players.len(), 0);

        // check the rooms exits
        // there should be 3 exits
        let exits: Array<felt252> = barn.dirObjIds.clone();
        assert_eq!(exits.len(), 3, "got {:?}, expected {:?}", exits.len(), 2);
    }

    #[test]
    #[available_gas(600000000)]
    fn test_spawn_barn_exit_properties () {
        // room should have:
        // 2 exit
        // exit W should have:
        // 2 action
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


        let room_name: ByteArray = "Eli's Barn";
        let barn_id: felt252 = p_hash::str_hash(@room_name);

        let barn: Room = sys.world.read_model(barn_id);

        // room should have 3 exits 
        let exits: Array<felt252> = barn.dirObjIds.clone();
        assert_eq!(exits.len(), 3, "got {:?}, expected {:?}", exits.len(), 3);
        
        // exit EAST
        // NB this is a kludge, we should be able to get the exit in a more
        // elegant way
        let exit_w_id = exits.at(1).clone();
        let exit_w: Object = sys.world.read_model(exit_w_id);
        
        // assert that
        // exit EAST is a WINDOW
        assert_eq!(exit_w.objType, ObjectType::Window, "got {:?}, expected {:?}", exit_w.objType, ObjectType::Window);
        // exit EAST destination should be:
        // eli's forge
        // ids match
        let dest_w_name = "Eli's Forge";
        let dest_w_id = p_hash::str_hash(@dest_w_name);
        assert_eq!(exit_w.destId, dest_w_id, "got {:?}, expected {:?}", exit_w.destId, dest_w_id);
        // description matches
        let txt_id = exit_w.txtDefId;
        let txt: Txtdef = sys.world.read_model(txt_id);
        let _desc = txt.text.clone();
        let _desc_expected = "a dusty window set at chest height in the west wall";
        assert_eq!(_desc, _desc_expected, "got {:?}, expected {:?}", _desc, _desc_expected);
        // exit WEST should be a window
        assert_eq!(exit_w.objType, ObjectType::Window, "got {:?}, expected {:?}", exit_w.objType, ObjectType::Window);
        // exit direction should be:
        // West
        assert_eq!(exit_w.dirType, DirectionType::West, "got {:?}, expected {:?}", exit_w.dirType, DirectionType::West);
        // exit material should be:
        // Glass
        assert_eq!(exit_w.matType, MaterialType::Glass, "got {:?}, expected {:?}", exit_w.matType, MaterialType::Glass);
        // action
        // 2 actions
        let actions: Array<felt252> = exit_w.objectActionIds.clone();
        assert_eq!(actions.len(), 2, "got {:?}, expected {:?}", actions.len(), 1);

       let open_action_id = actions.at(0).clone();
       let open_action: Action = sys.world.read_model(open_action_id);

        // action 1 should be:
        // open
       assert_eq!(open_action.actionType, ActionType::Open, "got {:?}, expected {:?}", open_action.actionType, ActionType::Open);
       // !revertable
       assert_eq!(open_action.revertable, false, "got {:?}, expected {:?}", open_action.revertable, false);
       // dBit
       assert_eq!(open_action.dBit, false, "got {:?}, expected {:?}", open_action.dBit, false);
       // enabled
       assert_eq!(open_action.enabled, false, "got {:?}, expected {:?}", open_action.enabled, false);
       // affectsActionId 
       assert_eq!(open_action.affectsActionId, 0, "got {:?}, expected {:?}", open_action.affectsActionId, 0);

       // actions chain
       // action 2
       let break_action_id = actions.at(1).clone();
       let break_action: Action = sys.world.read_model(break_action_id);
       // action is smashable
       assert_eq!(break_action.actionType, ActionType::Break, "got {:?}, expected {:?}", break_action.actionType, ActionType::Break);
       
       // action is not revertable
       assert_eq!(break_action.revertable, false, "got {:?}, expected {:?}", break_action.revertable, false);
       // action is not dBit
       assert_eq!(break_action.dBit, false, "got {:?}, expected {:?}", break_action.dBit, false);
       // action is enabled
       assert_eq!(break_action.enabled, true, "got {:?}, expected {:?}", break_action.enabled, true);
       // smash affects open
       assert_eq!(break_action.affectsActionId, open_action.actionId, "got {:?}, expected {:?}", break_action.affectsActionId, open_action.actionId);
       // break action is not affected by anything
       assert_eq!(break_action.affectedByActionId, 0, "got {:?}, expected {:?}", break_action.affectedByActionId, 0);
       
       // SOUTH
        let exit_s_id = exits.at(0).clone();
        let exit_s: Object = sys.world.read_model(exit_s_id);
        // exit direction should be:
        // South
        assert_eq!(exit_s.dirType, DirectionType::South, "got {:?}, expected {:?}", exit_s.dirType, DirectionType::South);

        // SOUTH destination should be:
        // benson' plain
        // ids match
        let dest_name = "Bensons Plain";
        let dest_id = p_hash::str_hash(@dest_name);
        assert_eq!(exit_s.destId, dest_id, "got {:?}, expected {:?}", exit_s.destId, dest_id);
        // description matches
        let txt_id = exit_s.txtDefId;
        let txt: Txtdef = sys.world.read_model(txt_id);
        let _desc = txt.text.clone();
        let _desc_expected = "an old wooden barn door, leads south";
        assert_eq!(_desc, _desc_expected, "got {:?}, expected {:?}", _desc, _desc_expected);
        // exit SOUTH should be a path
        assert_eq!(exit_s.objType, ObjectType::Door, "got {:?}, expected {:?}", exit_s.objType, ObjectType::Door);
        // exit material should be:
        // Dirt
        assert_eq!(exit_s.matType, MaterialType::Wood, "got {:?}, expected {:?}", exit_s.matType, MaterialType::Wood);
        // 1 action
        let actions: Array<felt252> = exit_s.objectActionIds.clone();
        assert_eq!(actions.len(), 1, "got {:?}, expected {:?}", actions.len(), 1);

        // SOUTH ACTIONS
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
        // actions chain is correct
        assert_eq!(action.affectsActionId, 0, "got {:?}, expected {:?}", action.affectsActionId, 0);
        // affectedByActionId 0
        assert_eq!(action.affectedByActionId, 0, "got {:?}, expected {:?}", action.affectedByActionId, 0);


        // DOWN
        let exit_d_id = exits.at(2).clone();
        let exit_d: Object = sys.world.read_model(exit_d_id);
        // exit direction should be:
        // Down
        assert_eq!(exit_d.dirType, DirectionType::Down, "got {:?}, expected {:?}", exit_s.dirType, DirectionType::Down);

        // DOWN destination should be:
        // benson' plain
        // ids match
        let dest_name = "Eli's Basement";
        let dest_id = p_hash::str_hash(@dest_name);
        assert_eq!(exit_d.destId, dest_id, "got {:?}, expected {:?}", exit_d.destId, dest_id);
        // description matches
        let txt_id = exit_d.txtDefId;
        let txt: Txtdef = sys.world.read_model(txt_id);
        let _desc = txt.text.clone();
        let _desc_expected = "a wooden trap door, is set in the floor leading downwards";
        assert_eq!(_desc, _desc_expected, "got {:?}, expected {:?}", _desc, _desc_expected);
        
        // DOWN ACTIONS
        let actions: Array<felt252> = exit_d.objectActionIds.clone();
        assert_eq!(actions.len(), 1, "got {:?}, expected {:?}", actions.len(), 1);

        let action_id = actions.at(0).clone();
        let action_d: Action = sys.world.read_model(action_id);

        // action should be:
        // open
        assert_eq!(action_d.actionType, ActionType::Open, "got {:?}, expected {:?}", action_d.actionType, ActionType::Open);
        // revertable
        assert_eq!(action_d.revertable, true, "got {:?}, expected {:?}", action_d.revertable, true);
        // !dBit
        assert_eq!(action_d.dBit, false, "got {:?}, expected {:?}", action_d.dBit, false);
        // !enabled
        assert_eq!(action_d.enabled, false, "got {:?}, expected {:?}", action_d.enabled, false);
        // actions chain is correct
        assert_eq!(action_d.affectsActionId, 0, "got {:?}, expected {:?}", action_d.affectsActionId, 0);
        // affectedByActionId burn on the hay bale
        assert_eq!(action_d.affectedByActionId, 1563879268193041819558919326443056939467944909908174932852604425697481554773, "got {:?}, expected {:?}", action_d.affectedByActionId, 1563879268193041819558919326443056939467944909908174932852604425697481554773);

        // the basement trap door should be affected by the "burn" on the hay bale
        let action_b: Action = sys.world.read_model( 1563879268193041819558919326443056939467944909908174932852604425697481554773);
        // action should be:
        // burn
        assert_eq!(action_b.actionType, ActionType::Burn, "got {:?}, expected {:?}", action_b.actionType, ActionType::Burn);
        // !revertable
        assert_eq!(action_b.revertable, false, "got {:?}, expected {:?}", action_b.revertable, false);
        // !dBit
        assert_eq!(action_b.dBit, false, "got {:?}, expected {:?}", action_b.dBit, false);
        // !enabled
        assert_eq!(action_b.enabled, false, "got {:?}, expected {:?}", action_b.enabled, false);
        // affectsActionId open on the trapdoor
        assert_eq!(action_b.affectsActionId, action_d.actionId, "got {:?}, expected {:?}", action_b.affectsActionId, action_d.actionId);
    }
}
