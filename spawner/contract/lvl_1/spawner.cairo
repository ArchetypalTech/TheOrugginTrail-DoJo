#[dojo::interface]
trait ISpawner<T> {
    fn setup(ref world: IWorldDispatcher);
    fn spawn_player(ref world: IWorldDispatcher, pid: felt252, start_room: felt252);
}

#[dojo::contract]
pub mod spawner {
    use starknet::{ContractAddress, testing, get_caller_address};
    use core::byte_array::ByteArrayTrait;
    use core::array::ArrayTrait;
    use core::option::OptionTrait;
    use super::ISpawner;

    use the_oruggin_trail::models::{
        zrk_enums as zrk, txtdef::{Txtdef}, action::{Action}, object::{Object}, room::{Room}, player::{Player}
    };

    use the_oruggin_trail::constants::zrk_constants as zc;
    use the_oruggin_trail::constants::zrk_constants::{roomid as rm, statusid as st};

    use the_oruggin_trail::lib::hash_utils::hashutils as h_util;


    #[abi(embed_v0)]
    impl SpawnerImpl of ISpawner<ContractState> {
        fn setup(ref world: IWorldDispatcher) {
            make_rooms(world, 23);
        }

        fn spawn_player(ref world: IWorldDispatcher, pid: felt252, start_room: felt252) {
            let player = Player{
                player_id: pid,
                player_adr: OTHER(),
                location: start_room,
            };
            set!(world,(player));
        }

    }

   

    fn OTHER() -> ContractAddress { starknet::contract_address_const::<0x2>() }


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
        // Eli's Barn
        let _  = gen_room_13246886194600585633(w, pl);
        // Bensons plain
        let _  = gen_room_15740072870286221930(w, pl);
        // Eli's Forge
        let _  = gen_room_12897738261327393418(w, pl);
        // Walking Eagle Pass
        let _  = gen_room_8892581999139148090(w, pl);
        // Eli's Barn
        let _  = gen_room_11107137240536497418(w, pl);
    }

    
    // 1. Eli's Barn: the barn is old and smells of old hay and oddly dissolution\nthe floor is dirt and trampled dried horse shit scattered with straw and broken bottles\nthe smell is not unpleasent and reminds you faintly of petrol and old socks
    fn gen_room_13246886194600585633(w: IWorldDispatcher, playerid: felt252) {// object 4405246086034713577// action 16332049259031098349
        let mut action_4405246086034713577_16332049259031098349 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the door, closes with a creak", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_4405246086034713577_16332049259031098349 = h_util::action_hash(@action_4405246086034713577_16332049259031098349 );
        action_4405246086034713577_16332049259031098349.actionId = action_id_4405246086034713577_16332049259031098349;
        
        let destination = "bensons-plain.md";
        let mut object_4405246086034713577 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Door,
            matType: zrk::MaterialType::Wood,
            dirType: zrk::DirectionType::South,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_4405246086034713577_16332049259031098349,],
            txtDefId: st::SETME 
        };

        let object_id_4405246086034713577 = h_util::obj_hash(@object_4405246086034713577); 
        object_4405246086034713577.objectId = object_id_4405246086034713577;
        let object_desc: ByteArray = "an old wooden barn door, leads south";
        let td_id_b = h_util::str_hash(@object_desc);
        object_4405246086034713577.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_4405246086034713577, object_desc);

        
        // object 15610790850353037754// action 12578911564611469734
        let mut action_15610790850353037754_12578911564611469734 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the window, now broken, falls open", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_15610790850353037754_12578911564611469734 = h_util::action_hash(@action_15610790850353037754_12578911564611469734 );
        action_15610790850353037754_12578911564611469734.actionId = action_id_15610790850353037754_12578911564611469734;
        
        // action 6636732390253036532
        let mut action_15610790850353037754_6636732390253036532 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Break,  
            dBitTxt: "the window, smashes, glass flies everywhere, very very satisfying", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_15610790850353037754_6636732390253036532 = h_util::action_hash(@action_15610790850353037754_6636732390253036532 );
        action_15610790850353037754_6636732390253036532.actionId = action_id_15610790850353037754_6636732390253036532;
        
        let destination = "elis-forge.md";
        let mut object_15610790850353037754 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Window,
            matType: zrk::MaterialType::Glass,
            dirType: zrk::DirectionType::West,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_15610790850353037754_12578911564611469734,action_id_15610790850353037754_6636732390253036532,],
            txtDefId: st::SETME 
        };

        let object_id_15610790850353037754 = h_util::obj_hash(@object_15610790850353037754); 
        object_15610790850353037754.objectId = object_id_15610790850353037754;
        let object_desc: ByteArray = "a dusty window, at chest height";
        let td_id_b = h_util::str_hash(@object_desc);
        object_15610790850353037754.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_15610790850353037754, object_desc);

        
        store_actions(w, array![action_4405246086034713577_16332049259031098349,]);
        store_actions(w, array![action_15610790850353037754_12578911564611469734,action_15610790850353037754_6636732390253036532,]);
        store_objects(w, array![object_4405246086034713577]);store_objects(w, array![object_15610790850353037754]);// store_objects(w, array![object_4405246086034713577,object_15610790850353037754,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "the barn is old and smells of old hay and oddly dissolution\nthe floor is dirt and trampled dried horse shit scattered with straw and broken bottles\nthe smell is not unpleasent and reminds you faintly of petrol and old socks";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Eli's Barn";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Barn,
            biomeType: zrk::BiomeType::None, // TODO
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![],
            dirObjIds: array![object_id_4405246086034713577,object_id_15610790850353037754,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }
    // 2. Bensons plain: the plain reaches seemingly endlessly to the sky in all directions\nand the sky itself feels greasy and cold.\npyramidal rough shapes dot the horizin and land which\nupon closer examination are made from bufalo skulls.\nThe air tastes of grease and bensons.\nhappy happy happy
    fn gen_room_15740072870286221930(w: IWorldDispatcher, playerid: felt252) {// object 4142895348942435842// action 16668157595971844890
        let mut action_4142895348942435842_16668157595971844890 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the path winds east, it is open", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_4142895348942435842_16668157595971844890 = h_util::action_hash(@action_4142895348942435842_16668157595971844890 );
        action_4142895348942435842_16668157595971844890.actionId = action_id_4142895348942435842_16668157595971844890;
        
        let destination = "walking-eagle-pass.md";
        let mut object_4142895348942435842 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Dirt,
            dirType: zrk::DirectionType::East,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_4142895348942435842_16668157595971844890,],
            txtDefId: st::SETME 
        };

        let object_id_4142895348942435842 = h_util::obj_hash(@object_4142895348942435842); 
        object_4142895348942435842.objectId = object_id_4142895348942435842;
        let object_desc: ByteArray = "a path east leads upwards toward the mountains";
        let td_id_b = h_util::str_hash(@object_desc);
        object_4142895348942435842.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_4142895348942435842, object_desc);

        
        // object 2294365566944327029// action 13058015828559547750
        let mut action_2294365566944327029_13058015828559547750 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the path heads north, it leads to a barn", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_2294365566944327029_13058015828559547750 = h_util::action_hash(@action_2294365566944327029_13058015828559547750 );
        action_2294365566944327029_13058015828559547750.actionId = action_id_2294365566944327029_13058015828559547750;
        
        let destination = "elis-barn.md";
        let mut object_2294365566944327029 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Dirt,
            dirType: zrk::DirectionType::North,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_2294365566944327029_13058015828559547750,],
            txtDefId: st::SETME 
        };

        let object_id_2294365566944327029 = h_util::obj_hash(@object_2294365566944327029); 
        object_2294365566944327029.objectId = object_id_2294365566944327029;
        let object_desc: ByteArray = "a path north leads toward a large wooden barn";
        let td_id_b = h_util::str_hash(@object_desc);
        object_2294365566944327029.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_2294365566944327029, object_desc);

        
        // object 17189994194645879202// action 15552978697807030543
        let mut action_17189994194645879202_15552978697807030543 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Kick,  
            dBitTxt: "the ball bounces feebly and rolls into some dog shit. fun.", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_17189994194645879202_15552978697807030543 = h_util::action_hash(@action_17189994194645879202_15552978697807030543 );
        action_17189994194645879202_15552978697807030543.actionId = action_id_17189994194645879202_15552978697807030543;
        
        let mut object_17189994194645879202 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Ball,
            matType: zrk::MaterialType::Leather,
            dirType: zrk::DirectionType::None,
            destId: st::NONE,
            objectActionIds: array![action_id_17189994194645879202_15552978697807030543,],
            txtDefId: st::SETME 
        };

        let object_id_17189994194645879202 = h_util::obj_hash(@object_17189994194645879202); 
        object_17189994194645879202.objectId = object_id_17189994194645879202;
        let object_desc: ByteArray = "a knock off UEFA football\nits a bit battered and bruised\nnot exactly a sphere\nbut you can kick it";
        let td_id_b = h_util::str_hash(@object_desc);
        object_17189994194645879202.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_17189994194645879202, object_desc);

        
        store_actions(w, array![action_4142895348942435842_16668157595971844890,]);
        store_actions(w, array![action_2294365566944327029_13058015828559547750,]);
        store_actions(w, array![action_17189994194645879202_15552978697807030543,]);
        store_objects(w, array![object_4142895348942435842]);store_objects(w, array![object_2294365566944327029]);store_objects(w, array![object_17189994194645879202]);// store_objects(w, array![object_4142895348942435842,object_2294365566944327029,object_17189994194645879202,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "the plain reaches seemingly endlessly to the sky in all directions\nand the sky itself feels greasy and cold.\npyramidal rough shapes dot the horizin and land which\nupon closer examination are made from bufalo skulls.\nThe air tastes of grease and bensons.\nhappy happy happy";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Bensons plain";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Plain,
            biomeType: zrk::BiomeType::None, // TODO
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![object_id_17189994194645879202,],
            dirObjIds: array![object_id_4142895348942435842,object_id_2294365566944327029,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }
    // 3. Eli's Forge: has been shuttered, well the door has been nailed shut and the window locked\nfrom this side. Now that the window is smashed light creeps in from the barn and through the cracks in the walls and roof\nthe hearth is cold and the place smells of petrol and soot
    fn gen_room_12897738261327393418(w: IWorldDispatcher, playerid: felt252) {// object 2655229238403616021// action 17136525110814971091
        let mut action_2655229238403616021_17136525110814971091 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the window, closes with a creak", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_2655229238403616021_17136525110814971091 = h_util::action_hash(@action_2655229238403616021_17136525110814971091 );
        action_2655229238403616021_17136525110814971091.actionId = action_id_2655229238403616021_17136525110814971091;
        
        // action 11591880505556989562
        let mut action_2655229238403616021_11591880505556989562 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Break,  
            dBitTxt: "the window, smashes, glass flies everywhere, very very satisfying", enabled: false, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_2655229238403616021_11591880505556989562 = h_util::action_hash(@action_2655229238403616021_11591880505556989562 );
        action_2655229238403616021_11591880505556989562.actionId = action_id_2655229238403616021_11591880505556989562;
        
        let destination = "elis-barn.md";
        let mut object_2655229238403616021 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Window,
            matType: zrk::MaterialType::Glass,
            dirType: zrk::DirectionType::East,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_2655229238403616021_17136525110814971091,action_id_2655229238403616021_11591880505556989562,],
            txtDefId: st::SETME 
        };

        let object_id_2655229238403616021 = h_util::obj_hash(@object_2655229238403616021); 
        object_2655229238403616021.objectId = object_id_2655229238403616021;
        let object_desc: ByteArray = "a dusty window, at chest height";
        let td_id_b = h_util::str_hash(@object_desc);
        object_2655229238403616021.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_2655229238403616021, object_desc);

        
        // object 3265630872681576966// action 6466932570877652873
        let mut action_3265630872681576966_6466932570877652873 = Action{
            actionId: st::NONE, 
            actionType: UNKNOWN ACTION TYPE,  
            dBitTxt: "the petrol bursts into flames", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_3265630872681576966_6466932570877652873 = h_util::action_hash(@action_3265630872681576966_6466932570877652873 );
        action_3265630872681576966_6466932570877652873.actionId = action_id_3265630872681576966_6466932570877652873;
        
        let mut object_3265630872681576966 = Object{
            objectId: st::SETME, 
            objType: UNKNOWN OBJECT TYPE,
            matType: UNKNOWN MATERIAL TYPE,
            dirType: zrk::DirectionType::None,
            destId: st::NONE,
            objectActionIds: array![action_id_3265630872681576966_6466932570877652873,],
            txtDefId: st::SETME 
        };

        let object_id_3265630872681576966 = h_util::obj_hash(@object_3265630872681576966); 
        object_3265630872681576966.objectId = object_id_3265630872681576966;
        let object_desc: ByteArray = "a army issue petrol can\ntrade marked Cthonian Petroleum Corp n.23";
        let td_id_b = h_util::str_hash(@object_desc);
        object_3265630872681576966.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_3265630872681576966, object_desc);

        
        // object 5316783824151223577// action 10056273856291699603
        let mut action_5316783824151223577_10056273856291699603 = Action{
            actionId: st::NONE, 
            actionType: UNKNOWN ACTION TYPE,  
            dBitTxt: "the match, burns with a blue flame", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_5316783824151223577_10056273856291699603 = h_util::action_hash(@action_5316783824151223577_10056273856291699603 );
        action_5316783824151223577_10056273856291699603.actionId = action_id_5316783824151223577_10056273856291699603;
        
        let mut object_5316783824151223577 = Object{
            objectId: st::SETME, 
            objType: UNKNOWN OBJECT TYPE,
            matType: UNKNOWN MATERIAL TYPE,
            dirType: zrk::DirectionType::None,
            destId: st::NONE,
            objectActionIds: array![action_id_5316783824151223577_10056273856291699603,],
            txtDefId: st::SETME 
        };

        let object_id_5316783824151223577 = h_util::obj_hash(@object_5316783824151223577); 
        object_5316783824151223577.objectId = object_id_5316783824151223577;
        let object_desc: ByteArray = "a wooden match box\ntrade marked Shoggoth's Joy";
        let td_id_b = h_util::str_hash(@object_desc);
        object_5316783824151223577.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_5316783824151223577, object_desc);

        
        store_actions(w, array![action_2655229238403616021_17136525110814971091,action_2655229238403616021_11591880505556989562,]);
        store_actions(w, array![action_3265630872681576966_6466932570877652873,]);
        store_actions(w, array![action_5316783824151223577_10056273856291699603,]);
        store_objects(w, array![object_2655229238403616021]);store_objects(w, array![object_3265630872681576966]);store_objects(w, array![object_5316783824151223577]);// store_objects(w, array![object_2655229238403616021,object_3265630872681576966,object_5316783824151223577,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "has been shuttered, well the door has been nailed shut and the window locked\nfrom this side. Now that the window is smashed light creeps in from the barn and through the cracks in the walls and roof\nthe hearth is cold and the place smells of petrol and soot";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Eli's Forge";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: UNKNOWN ROOM TYPE,
            biomeType: zrk::BiomeType::None, // TODO
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![object_id_3265630872681576966,object_id_5316783824151223577,],
            dirObjIds: array![object_id_2655229238403616021,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }
    // 4. Walking Eagle Pass: it winds through the mountains, the path is treacherous\ntoilet papered trees cover the steep\nvalley sides below you.\nOn closer inspection the TP might\nbe the remains of a cricket team\nor perhaps a lost and very dead KKK picnic group.\nIt's brass monkeys.
    fn gen_room_8892581999139148090(w: IWorldDispatcher, playerid: felt252) {// object 745772409139972109// action 14833044636746871315
        let mut action_745772409139972109_14833044636746871315 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the path winds west, it is open", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_745772409139972109_14833044636746871315 = h_util::action_hash(@action_745772409139972109_14833044636746871315 );
        action_745772409139972109_14833044636746871315.actionId = action_id_745772409139972109_14833044636746871315;
        
        let destination = "bensons-plain.md";
        let mut object_745772409139972109 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Dirt,
            dirType: zrk::DirectionType::West,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_745772409139972109_14833044636746871315,],
            txtDefId: st::SETME 
        };

        let object_id_745772409139972109 = h_util::obj_hash(@object_745772409139972109); 
        object_745772409139972109.objectId = object_id_745772409139972109;
        let object_desc: ByteArray = "path";
        let td_id_b = h_util::str_hash(@object_desc);
        object_745772409139972109.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_745772409139972109, object_desc);

        
        store_actions(w, array![action_745772409139972109_14833044636746871315,]);
        store_objects(w, array![object_745772409139972109]);// store_objects(w, array![object_745772409139972109,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "it winds through the mountains, the path is treacherous\ntoilet papered trees cover the steep\nvalley sides below you.\nOn closer inspection the TP might\nbe the remains of a cricket team\nor perhaps a lost and very dead KKK picnic group.\nIt's brass monkeys.";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Walking Eagle Pass";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Mountains,
            biomeType: zrk::BiomeType::None, // TODO
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![],
            dirObjIds: array![object_id_745772409139972109,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }
    // 5. Eli's Barn: the barn is old and smells of old hay and oddly dissolution\nthe floor is dirt and trampled dried horse shit scattered with straw and broken bottles\nthe smell is not unpleasent and reminds you faintly of petrol and old socks
    fn gen_room_11107137240536497418(w: IWorldDispatcher, playerid: felt252) {// object 10414226638441273874// action 4328927602301159032
        let mut action_10414226638441273874_4328927602301159032 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the door, closes with a creak", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_10414226638441273874_4328927602301159032 = h_util::action_hash(@action_10414226638441273874_4328927602301159032 );
        action_10414226638441273874_4328927602301159032.actionId = action_id_10414226638441273874_4328927602301159032;
        
        let destination = "bensons-plain.md";
        let mut object_10414226638441273874 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Door,
            matType: zrk::MaterialType::Wood,
            dirType: zrk::DirectionType::South,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_10414226638441273874_4328927602301159032,],
            txtDefId: st::SETME 
        };

        let object_id_10414226638441273874 = h_util::obj_hash(@object_10414226638441273874); 
        object_10414226638441273874.objectId = object_id_10414226638441273874;
        let object_desc: ByteArray = "an old wooden barn door, leads south";
        let td_id_b = h_util::str_hash(@object_desc);
        object_10414226638441273874.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_10414226638441273874, object_desc);

        
        // object 4916953867006087388// action 14604306511083742153
        let mut action_4916953867006087388_14604306511083742153 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the window, now broken, falls open", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_4916953867006087388_14604306511083742153 = h_util::action_hash(@action_4916953867006087388_14604306511083742153 );
        action_4916953867006087388_14604306511083742153.actionId = action_id_4916953867006087388_14604306511083742153;
        
        // action 3629301349604561982
        let mut action_4916953867006087388_3629301349604561982 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Break,  
            dBitTxt: "the window, smashes, glass flies everywhere, very very satisfying", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };
        
        let action_id_4916953867006087388_3629301349604561982 = h_util::action_hash(@action_4916953867006087388_3629301349604561982 );
        action_4916953867006087388_3629301349604561982.actionId = action_id_4916953867006087388_3629301349604561982;
        
        let destination = "elis-forge.md";
        let mut object_4916953867006087388 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Window,
            matType: zrk::MaterialType::Glass,
            dirType: zrk::DirectionType::West,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_4916953867006087388_14604306511083742153,action_id_4916953867006087388_3629301349604561982,],
            txtDefId: st::SETME 
        };

        let object_id_4916953867006087388 = h_util::obj_hash(@object_4916953867006087388); 
        object_4916953867006087388.objectId = object_id_4916953867006087388;
        let object_desc: ByteArray = "a dusty window, at chest height";
        let td_id_b = h_util::str_hash(@object_desc);
        object_4916953867006087388.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_4916953867006087388, object_desc);

        
        store_actions(w, array![action_10414226638441273874_4328927602301159032,]);
        store_actions(w, array![action_4916953867006087388_14604306511083742153,action_4916953867006087388_3629301349604561982,]);
        store_objects(w, array![object_10414226638441273874]);store_objects(w, array![object_4916953867006087388]);// store_objects(w, array![object_10414226638441273874,object_4916953867006087388,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "the barn is old and smells of old hay and oddly dissolution\nthe floor is dirt and trampled dried horse shit scattered with straw and broken bottles\nthe smell is not unpleasent and reminds you faintly of petrol and old socks";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Eli's Barn";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Barn,
            biomeType: zrk::BiomeType::None, // TODO
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![],
            dirObjIds: array![object_id_10414226638441273874,object_id_4916953867006087388,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }}