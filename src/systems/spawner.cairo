#[dojo::interface]
trait ISpawner<T> {
    fn setup(ref world: IWorldDispatcher);
}

#[dojo::contract]
pub mod spawner {
    use core::byte_array::ByteArrayTrait;
    use core::array::ArrayTrait;
    use core::option::OptionTrait;
    use super::ISpawner;

    use the_oruggin_trail::models::{
        zrk_enums as zrk, txtdef::{Txtdef}, action::{Action}, object::{Object}, room::{Room}
    };

    use the_oruggin_trail::constants::zrk_constants as zc;
    use the_oruggin_trail::constants::zrk_constants::{roomid as rm, statusid as st};

    use the_oruggin_trail::lib::hash_utils::hashutils as h_util;


    #[abi(embed_v0)]
    impl SpawnerImpl of ISpawner<ContractState> {
        fn setup(ref world: IWorldDispatcher) {
            make_rooms(world, 23);
        }
    }

    fn store_objects(w: IWorldDispatcher, t: Array<Object>) {
        for o in t {
            set!(w, (o));
        }
    }

    fn store_actions(w: IWorldDispatcher, t: Array<Action>) {
        for o in t {
            set!(w, (o));
        }
    }

    fn store_places(w: IWorldDispatcher, t: Array<Room>) {
        for o in t {
            set!(w, (o));
        }
    }

    fn store_txt(world: IWorldDispatcher, id: felt252, ownedBy: felt252, val: ByteArray) {
        set!(world, (Txtdef { id: id, owner: ownedBy, text: val },));
    }

    // --------------------------------------------------------------------------------------------
    // GENERATED
    // --------------------------------------------------------------------------------------------

    fn make_rooms(w: IWorldDispatcher, pl: felt252) {
        // bensons plain
        let _  = gen_room_1(w, pl);
        // eli's barn
        let _  = gen_room_2(w, pl);
        // walking eagle pass
        let _  = gen_room_3(w, pl);
    }

    
    // 1. bensons plain: the plain reaches seemingly endlessly to the sky in all directions\nand the sky itself feels greasy and cold.\npyramidal rough shapes dot the horizin and land which\nupon closer examination are made from bufalo skulls.\nThe air tastes of grease and bensons.\nhappy happy happy\n
    fn gen_room_1(w: IWorldDispatcher, playerid: felt252) {// object 1// action 1
        let mut action_1_1 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the path winds east, it is open", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_1_1 = h_util::action_hash(@action_1_1 );
        action_1_1.actionId = action_id_1_1;
        
        let destination = "walking eagle pass";
        let mut object_1 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Dirt,
            dirType: zrk::DirectionType::East,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_1_1,],
            txtDefId: st::SETME 
        };

        let object_id_1 = h_util::obj_hash(@object_1); 
        object_1.objectId = object_id_1;
        let object_desc: ByteArray = "a path east leads upwards toward the mountains";
        let td_id_b = h_util::str_hash(@object_desc);
        object_1.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_1, object_desc);

        
        // object 2// action 1
        let mut action_2_1 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the path heads north, it leads to a barn", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_2_1 = h_util::action_hash(@action_2_1 );
        action_2_1.actionId = action_id_2_1;
        
        let destination = "eli's barn";
        let mut object_2 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Dirt,
            dirType: zrk::DirectionType::North,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_2_1,],
            txtDefId: st::SETME 
        };

        let object_id_2 = h_util::obj_hash(@object_2); 
        object_2.objectId = object_id_2;
        let object_desc: ByteArray = "a path north leads toward a large wooden barn";
        let td_id_b = h_util::str_hash(@object_desc);
        object_2.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_2, object_desc);

        
        // object 3// action 1
        let mut action_3_1 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Kick,  
            dBitTxt: "the ball bounces feebly and rolls into some dog shit. fun.", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_3_1 = h_util::action_hash(@action_3_1 );
        action_3_1.actionId = action_id_3_1;
        
        let mut object_3 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Ball,
            matType: zrk::MaterialType::Leather,
            dirType: zrk::DirectionType::None,
            destId: st::NONE,
            objectActionIds: array![action_id_3_1,],
            txtDefId: st::SETME 
        };

        let object_id_3 = h_util::obj_hash(@object_3); 
        object_3.objectId = object_id_3;
        let object_desc: ByteArray = "a knock off UEFA football\nits a bit battered and bruised\nnot exactly a sphere\nbut you can kick it";
        let td_id_b = h_util::str_hash(@object_desc);
        object_3.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_3, object_desc);

        
        store_actions(w, array![action_1_1,]);
        store_actions(w, array![action_2_1,]);
        store_actions(w, array![action_3_1,]);
        store_objects(w, array![object_1]);store_objects(w, array![object_2]);store_objects(w, array![object_3]);// store_objects(w, array![object_1,object_2,object_3,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "the plain reaches seemingly endlessly to the sky in all directions\nand the sky itself feels greasy and cold.\npyramidal rough shapes dot the horizin and land which\nupon closer examination are made from bufalo skulls.\nThe air tastes of grease and bensons.\nhappy happy happy\n";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "bensons plain";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Plain,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![object_id_3,],
            dirObjIds: array![object_id_1,object_id_2,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }
    // 2. eli's barn: the barn is old and smells of old hay and oddly dissolution\nthe floor is dirt and trampled dried horse shit scattered with straw and broken bottles\nthe smell is not unpleasent and reminds you faintly of petrol and old socks
    fn gen_room_2(w: IWorldDispatcher, playerid: felt252) {// object 1// action 1
        let mut action_1_1 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the door, closes with a creak", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_1_1 = h_util::action_hash(@action_1_1 );
        action_1_1.actionId = action_id_1_1;
        
        let destination = "bensons plain";
        let mut object_1 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Door,
            matType: zrk::MaterialType::Wood,
            dirType: zrk::DirectionType::South,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_1_1,],
            txtDefId: st::SETME 
        };

        let object_id_1 = h_util::obj_hash(@object_1); 
        object_1.objectId = object_id_1;
        let object_desc: ByteArray = "an old wooden barn door, leads south";
        let td_id_b = h_util::str_hash(@object_desc);
        object_1.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_1, object_desc);

        
        // object 2// action 1
        let mut action_2_1 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the window, now broken, falls open", enabled: false, 
            revertable: false, dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_2_1 = h_util::action_hash(@action_2_1 );
        action_2_1.actionId = action_id_2_1;
        
        // action 2
        let mut action_2_2 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Break,  
            dBitTxt: "the window, smashes, glass flies everywhere, very very satisfying", enabled: true, 
            revertable: false, dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_2_2 = h_util::action_hash(@action_2_2 );
        action_2_2.actionId = action_id_2_2;
        
        let destination = "eli's forge";
        let mut object_2 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Window,
            matType: zrk::MaterialType::Glass,
            dirType: zrk::DirectionType::West,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_2_1,action_id_2_2,],
            txtDefId: st::SETME 
        };

        let object_id_2 = h_util::obj_hash(@object_2); 
        object_2.objectId = object_id_2;
        let object_desc: ByteArray = "a dusty window, at chest height";
        let td_id_b = h_util::str_hash(@object_desc);
        object_2.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_2, object_desc);

        
        store_actions(w, array![action_1_1,]);
        action_2_2.affectsActionId = action_id_2_1;
        action_2_1.affectedByActionId = action_id_2_2;store_actions(w, array![action_2_1,action_2_2,]);
        store_objects(w, array![object_1]);store_objects(w, array![object_2]);// store_objects(w, array![object_1,object_2,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "the barn is old and smells of old hay and oddly dissolution\nthe floor is dirt and trampled dried horse shit scattered with straw and broken bottles\nthe smell is not unpleasent and reminds you faintly of petrol and old socks";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "eli's barn";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Barn,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![],
            dirObjIds: array![object_id_1,object_id_2,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }
    // 3. walking eagle pass: it winds through the mountains, the path is treacherous\ntoilet papered trees cover the steep \nvalley sides below you.\nOn closer inspection the TP might \nbe the remains of a cricket team\nor perhaps a lost and very dead KKK picnic group.\nIt's brass monkeys.
    fn gen_room_3(w: IWorldDispatcher, playerid: felt252) {// object 1// action 1
        let mut action_1_1 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the path winds west, it is open", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_1_1 = h_util::action_hash(@action_1_1 );
        action_1_1.actionId = action_id_1_1;
        
        let destination = "bensons plain";
        let mut object_1 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Dirt,
            dirType: zrk::DirectionType::West,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_1_1,],
            txtDefId: st::SETME 
        };

        let object_id_1 = h_util::obj_hash(@object_1); 
        object_1.objectId = object_id_1;
        let object_desc: ByteArray = "path";
        let td_id_b = h_util::str_hash(@object_desc);
        object_1.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_1, object_desc);

        
        store_actions(w, array![action_1_1,]);
        store_objects(w, array![object_1]);// store_objects(w, array![object_1,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "it winds through the mountains, the path is treacherous\ntoilet papered trees cover the steep \nvalley sides below you.\nOn closer inspection the TP might \nbe the remains of a cricket team\nor perhaps a lost and very dead KKK picnic group.\nIt's brass monkeys.";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "walking eagle pass";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Mountains,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![],
            dirObjIds: array![object_id_1,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }}
