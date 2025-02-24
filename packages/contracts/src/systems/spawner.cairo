
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

#[starknet::interface]
pub trait ISpawner<T> {
    fn setup(ref self: T);
    fn spawn_player(ref self: T, pid: felt252, start_room: felt252);
}



#[dojo::contract]
pub mod spawner {
    use starknet::{ContractAddress, testing, get_caller_address};
    use core::byte_array::ByteArrayTrait;
    use core::array::ArrayTrait;
    use core::option::OptionTrait;
    use super::ISpawner;

    use the_oruggin_trail::models::{
        zrk_enums as zrk, 
        txtdef::{Txtdef}, 
        action::{Action}, 
        object::{Object}, 
        room::{Room}, 
        player::{Player},
        inventory::{Inventory}
    };

    use the_oruggin_trail::constants::zrk_constants as zc;
    use the_oruggin_trail::constants::zrk_constants::{roomid as rm, statusid as st};
    use the_oruggin_trail::lib::hash_utils::hashutils as h_util;
    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use dojo::model::{ModelStorage};

    #[abi(embed_v0)]
    pub impl SpawnerImpl of ISpawner<ContractState> {
        fn setup(ref self: ContractState) {
            let mut world = self.world(@"the_oruggin_trail");
            // println!("HNDL::SPWN:------> *");
            make_rooms(world.dispatcher, 23);
        }

        fn spawn_player(ref self: ContractState, pid: felt252, start_room: felt252) {
            let player = Player{
                player_id: pid,
                player_adr: OTHER(),
                location: start_room,
                inventory: pid
            };

            let mut world = self.world(@"the_oruggin_trail");
            let inv = Inventory {owner_id: pid, items: array![]};
            // println!("HNDL::SPWN_PL:------> *");
            world.write_model(@inv);
            world.write_model(@player);
        }
    }

    fn OTHER() -> ContractAddress { starknet::contract_address_const::<0x2>() }

    fn store_objects(w: IWorldDispatcher, t: Array<Object>) {
        let mut world: WorldStorage =  WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_actions(w: IWorldDispatcher, t: Array<Action>) {
        let mut world: WorldStorage =  WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_places(w: IWorldDispatcher, t: Array<Room>) {
        let mut world: WorldStorage =  WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            // println!("RM:----> {:?}", o);
            world.write_model(@o);
        }
    }

    fn store_txt(world: IWorldDispatcher, id: felt252, ownedBy: felt252, val: ByteArray) {
        let mut world: WorldStorage =  WorldStorageTrait::new(world, @"the_oruggin_trail");
        world.write_model(@Txtdef { id: id, owner: ownedBy, text: val });
    }

    // --------------------------------------------------------------------------------------------
    // GENERATED
    // --------------------------------------------------------------------------------------------

    fn make_rooms(w: IWorldDispatcher, pl: felt252) {
        // Eli's Basement
        // println!("-------->MAKE_ROOMS<---------");
        let _  = gen_room_13246886194600585633(w, pl);
        // Bensons plain
        let _  = gen_room_15740072870286221930(w, pl);
        // Eli's Forge
        let _  = gen_room_12897738261327393418(w, pl);
        // Walking Eagle Pass
        let _  = gen_room_8892581999139148090(w, pl);
        // The Alley Off Main Street
        let _  = gen_room_2103159215482208020(w, pl);
        // Eli's Barn
        let _  = gen_room_11107137240536497418(w, pl);
    }

    
    // 1. Eli's Basement: the basement is a converted root cellar, with a small stool bolted to the floor\nit is not a comforting room and reminds you of far to many movies that you probably never should have watched\nthe light is just enough that you don't have to see too much.\nit smells damp and somehow of bad faith.
    fn gen_room_13246886194600585633(w: IWorldDispatcher, playerid: felt252) {// object 4405246086034713577// action 16332049259031098349
        // println!("<-----------Eli's Basement");
        let mut action_4405246086034713577_16332049259031098349 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the trap door, closes with a bang", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_4405246086034713577_16332049259031098349 = h_util::action_hash(@action_4405246086034713577_16332049259031098349 );
        action_4405246086034713577_16332049259031098349.actionId = action_id_4405246086034713577_16332049259031098349;
        
        let destination = "Eli's Barn";
        let mut object_4405246086034713577 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Stairs,
            matType: zrk::MaterialType::Wood,
            dirType: zrk::DirectionType::Up,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_4405246086034713577_16332049259031098349,],
            txtDefId: st::SETME 
        };

        let object_id_4405246086034713577 = h_util::obj_hash(@object_4405246086034713577); 
        object_4405246086034713577.objectId = object_id_4405246086034713577;
        let object_desc: ByteArray = "a slightly charcoaled wooden set of stairs lead upwards";
        let td_id_b = h_util::str_hash(@object_desc);
        object_4405246086034713577.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_4405246086034713577, object_desc);

        
        // object 15610790850353037754// action 12578911564611469734
        let mut action_15610790850353037754_12578911564611469734 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Explode,  
            dBitTxt: "the dynamite detonates, you are lucky, the blast wave passes through you, you shit your pants involuntarily, you are spared the clean up by dint of now being largely composed of meaty paste.", enabled: false, 
            revertable: false, 
            dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_15610790850353037754_12578911564611469734 = h_util::action_hash(@action_15610790850353037754_12578911564611469734 );
        action_15610790850353037754_12578911564611469734.actionId = action_id_15610790850353037754_12578911564611469734;
        
        // action 6636732390253036532
        let mut action_15610790850353037754_6636732390253036532 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Ignite,  
            dBitTxt: "the fuse comes into menacing life, sparkling like a demented god, the air fills with the smell of gunpowder, its not at all unpleasant", 
            enabled: true, 
            revertable: false, 
            dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_15610790850353037754_6636732390253036532 = h_util::action_hash(@action_15610790850353037754_6636732390253036532 );
        action_15610790850353037754_6636732390253036532.actionId = action_id_15610790850353037754_6636732390253036532;
        
        action_15610790850353037754_12578911564611469734.affectedByActionId = action_id_15610790850353037754_6636732390253036532;
        action_15610790850353037754_6636732390253036532.affectsActionId = action_id_15610790850353037754_12578911564611469734;   
        
        let mut object_15610790850353037754 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Dynamite,
            matType: zrk::MaterialType::TNT,
            dirType: zrk::DirectionType::None,
            destId: st::NONE,
            objectActionIds: array![action_id_15610790850353037754_12578911564611469734,action_id_15610790850353037754_6636732390253036532,],
            txtDefId: st::SETME 
        };

        let object_id_15610790850353037754 = h_util::obj_hash(@object_15610790850353037754); 
        object_15610790850353037754.objectId = object_id_15610790850353037754;
        let object_desc: ByteArray = "a stick of slightly sweaty dynamite almost like a caricature of itself. It's fused and certainly unstable and capable of turning things including you into a fine meaty mist still holding exciteable explosives couldn't hurt right?";
        let td_id_b = h_util::str_hash(@object_desc);
        object_15610790850353037754.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_15610790850353037754, object_desc);

        
        store_actions(w, array![action_4405246086034713577_16332049259031098349,]);
        store_actions(w, array![action_15610790850353037754_12578911564611469734,action_15610790850353037754_6636732390253036532,]);
        store_objects(w, array![object_4405246086034713577]);store_objects(w, array![object_15610790850353037754]);// store_objects(w, array![object_4405246086034713577,object_15610790850353037754,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "the basement is a converted root cellar, with a small stool bolted to the floor\nit is not a comforting room and reminds you of far to many movies that you probably never should have watched\nthe light is just enough that you don't have to see too much.\nit smells damp and somehow of bad faith.";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Eli's Basement";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Basement,
            biomeType: zrk::BiomeType::Prarie,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![object_id_15610790850353037754,],
            dirObjIds: array![object_id_4405246086034713577,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }
    // 2. Bensons plain: the plain reaches seemingly endlessly to the sky in all directions\nand the sky itself feels greasy and cold.\npyramidal rough shapes dot the horizin and land which\nupon closer examination are made from bufalo skulls.\nThe air tastes of grease and bensons.\nhappy happy happy
    fn gen_room_15740072870286221930(w: IWorldDispatcher, playerid: felt252) {// object 4142895348942435842// action 16668157595971844890
        // println!("<------------ Bensons Plain");
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
        
        let destination = "Walking Eagle Pass";
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
        
        let destination = "Eli's Barn";
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
        store_objects(w, array![object_4142895348942435842]);
        store_objects(w, array![object_2294365566944327029]);
        store_objects(w, array![object_17189994194645879202]);
        // store_objects(w, array![object_4142895348942435842,object_2294365566944327029,object_17189994194645879202,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "the plain reaches seemingly endlessly to the sky in all directions\nand the sky itself feels greasy and cold.\npyramidal rough shapes dot the horizin and land which\nupon closer examination are made from bufalo skulls.\nThe air tastes of grease and bensons.\nhappy happy happy";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Bensons Plain";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Plain,
            biomeType: zrk::BiomeType::Prarie,
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
        // println!("<------------ Eli's Forge");
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
        
        let destination = "Eli's Barn";
        let mut object_2655229238403616021 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Window,
            matType: zrk::MaterialType::Glass,
            dirType: zrk::DirectionType::East,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_2655229238403616021_17136525110814971091,],
            txtDefId: st::SETME 
        };

        let object_id_2655229238403616021 = h_util::obj_hash(@object_2655229238403616021); 
        object_2655229238403616021.objectId = object_id_2655229238403616021;
        let object_desc: ByteArray = "a dusty and smashed window, at chest height";
        let td_id_b = h_util::str_hash(@object_desc);
        object_2655229238403616021.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_2655229238403616021, object_desc);

        
        // object 3265630872681576966// action 6466932570877652873
        let mut action_3265630872681576966_6466932570877652873 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Burn,  
            dBitTxt: "the petrol bursts into flames", 
            enabled: true, 
            revertable: false, 
            dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_3265630872681576966_6466932570877652873 = h_util::action_hash(@action_3265630872681576966_6466932570877652873 );
        action_3265630872681576966_6466932570877652873.actionId = action_id_3265630872681576966_6466932570877652873;
        
        let mut object_3265630872681576966 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Petrol,
            matType: zrk::MaterialType::Metal,
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
            actionType: zrk::ActionType::Burn,  
            dBitTxt: "the match, burns with a blue flame",
            enabled: true, 
            revertable: false, 
            dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_5316783824151223577_10056273856291699603 = h_util::action_hash(@action_5316783824151223577_10056273856291699603 );
        action_5316783824151223577_10056273856291699603.actionId = action_id_5316783824151223577_10056273856291699603;
        
        let mut object_5316783824151223577 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Matches,
            matType: zrk::MaterialType::Wood,
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

        
        store_actions(w, array![action_2655229238403616021_17136525110814971091,]);
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
            roomType: zrk::RoomType::Forge,
            biomeType: zrk::BiomeType::Prarie,
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
        // println!("<------------- Walking Eagle Pass");
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
        
        let destination = "Bensons Plain";
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
        let object_desc: ByteArray = "path leading west";
        let td_id_b = h_util::str_hash(@object_desc);
        object_745772409139972109.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_745772409139972109, object_desc);

        
        // object 7479341928096534711// action 9807140808976004456
        let mut action_7479341928096534711_9807140808976004456 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the path winds east, through piles of fresh rubble and charred pine cones", 
            enabled: false, 
            revertable: false, 
            dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_7479341928096534711_9807140808976004456 = h_util::action_hash(@action_7479341928096534711_9807140808976004456 );
        action_7479341928096534711_9807140808976004456.actionId = action_id_7479341928096534711_9807140808976004456;
        
        let destination = "The Alley Off Main Street";
        let mut object_7479341928096534711 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Dirt,
            dirType: zrk::DirectionType::East,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_7479341928096534711_9807140808976004456,],
            txtDefId: st::SETME 
        };

        let object_id_7479341928096534711 = h_util::obj_hash(@object_7479341928096534711); 
        object_7479341928096534711.objectId = object_id_7479341928096534711;
        let object_desc: ByteArray = "path leading east";
        let td_id_b = h_util::str_hash(@object_desc);
        object_7479341928096534711.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_7479341928096534711, object_desc);

        
        // object 383324005557581461// action 5294932446722202844
        let mut action_383324005557581461_5294932446722202844 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Disintegrate,  
            dBitTxt: "the boulder shatters into dust and shrapnel,\npieces fly,\ndeer run startled,\ncows drop dead,\ncrows and squirrels drop out of the sky.\nsatisfying essentially.\na small fly takes a dump in your ear. you don't notice this luckily.", enabled: true, 
            revertable: false, dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_383324005557581461_5294932446722202844 = h_util::action_hash(@action_383324005557581461_5294932446722202844 );
        action_383324005557581461_5294932446722202844.actionId = action_id_383324005557581461_5294932446722202844;
        
        let mut object_383324005557581461 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Boulder,
            matType: zrk::MaterialType::Stone,
            dirType: zrk::DirectionType::None,
            destId: st::NONE,
            objectActionIds: array![action_id_383324005557581461_5294932446722202844,],
            txtDefId: st::SETME 
        };

        let object_id_383324005557581461 = h_util::obj_hash(@object_383324005557581461); 
        object_383324005557581461.objectId = object_id_383324005557581461;
        let object_desc: ByteArray = "a huge boulder blocks the pass east,\nit is full of the stony remains of creatures designed by an easily bored god and then discarded.\ndarwin may have some thoughts on this.\nsomeone has drawn a cock on it.";
        let td_id_b = h_util::str_hash(@object_desc);
        object_383324005557581461.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_383324005557581461, object_desc);

        
        action_383324005557581461_5294932446722202844.affectsActionId = action_id_7479341928096534711_9807140808976004456;
        action_7479341928096534711_9807140808976004456.affectedByActionId = action_id_383324005557581461_5294932446722202844;
        store_actions(w, array![action_745772409139972109_14833044636746871315,]);
        store_actions(w, array![action_7479341928096534711_9807140808976004456,]);
        store_actions(w, array![action_383324005557581461_5294932446722202844,]);
        store_objects(w, array![object_745772409139972109]);
        store_objects(w, array![object_7479341928096534711]);
        store_objects(w, array![object_383324005557581461]);// store_objects(w, array![object_745772409139972109,object_7479341928096534711,object_383324005557581461,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "it winds through the mountains, the path is treacherous\ntoilet papered trees cover the steep\nvalley sides below you.\nOn closer inspection the TP might\nbe the remains of a cricket team\nor perhaps a lost and very dead KKK picnic group.\nIt's brass monkeys.";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Walking Eagle Pass";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Mountains,
            biomeType: zrk::BiomeType::Mountains,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![object_id_383324005557581461,],
            dirObjIds: array![object_id_745772409139972109,object_id_7479341928096534711,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }
    // 5. The Alley Off Main Street: the alley composed of stinking mud sits between main street and the praries, seems that\nthe town uses uses it as dump, for both iscared humans and discarded, well, literal shit.\nall in all not somewhere wants to linger unless dead, or drunk and in that case probably\nbest to be dead drunk.\noddly it reminds you of home. this isnt a good thing.
    fn gen_room_2103159215482208020(w: IWorldDispatcher, playerid: felt252) {// object 16637690103936120658// action 17581850991508748471
        // println!("<----------- The Alley Off Main Street");
        let mut action_16637690103936120658_17581850991508748471 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the path winds west", enabled: true, 
            revertable: false, dBit: true, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_16637690103936120658_17581850991508748471 = h_util::action_hash(@action_16637690103936120658_17581850991508748471 );
        action_16637690103936120658_17581850991508748471.actionId = action_id_16637690103936120658_17581850991508748471;
        
        let destination = "Walking Eagle Pass";
        let mut object_16637690103936120658 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Shit,
            dirType: zrk::DirectionType::North,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_16637690103936120658_17581850991508748471,],
            txtDefId: st::SETME 
        };

        let object_id_16637690103936120658 = h_util::obj_hash(@object_16637690103936120658); 
        object_16637690103936120658.objectId = object_id_16637690103936120658;
        let object_desc: ByteArray = "path";
        let td_id_b = h_util::str_hash(@object_desc);
        object_16637690103936120658.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_16637690103936120658, object_desc);

        
        store_actions(w, array![action_16637690103936120658_17581850991508748471,]);
        store_objects(w, array![object_16637690103936120658]);// store_objects(w, array![object_16637690103936120658,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "the alley composed of stinking mud sits between main street and the praries, seems that\nthe town uses uses it as dump, for both discarded humans and discarded, well, literal shit.\nall in all not somewhere wants to linger unless dead, or drunk and in that case probably\nbest to be dead drunk.\noddly it reminds you of home. this isnt a good thing.";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "The Alley Off Main Street";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Alley,
            biomeType: zrk::BiomeType::Prarie,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![],
            dirObjIds: array![object_id_16637690103936120658,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }
    // 6. Eli's Barn: the barn is old and smells of old hay and oddly dissolution\nthe floor is dirt and trampled dried horse shit scattered with straw and broken bottles\nthe smell is not unpleasent and reminds you faintly of petrol and old socks
    fn gen_room_11107137240536497418(w: IWorldDispatcher, playerid: felt252) {// object 10414226638441273874// action 4328927602301159032
        // println!("<-------------- Eli's Barn");
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
        
        let destination = "Bensons Plain";
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
            dBitTxt: "the window, now broken, falls open", 
            enabled: false, 
            revertable: false, 
            dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_4916953867006087388_14604306511083742153 = h_util::action_hash(@action_4916953867006087388_14604306511083742153 );
        action_4916953867006087388_14604306511083742153.actionId = action_id_4916953867006087388_14604306511083742153;
        
        // action 3629301349604561982
        let mut action_4916953867006087388_3629301349604561982 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Break,  
            dBitTxt: "the window, smashes, glass flies everywhere, very very satisfying", 
            enabled: true, 
            revertable: false,
            dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_4916953867006087388_3629301349604561982 = h_util::action_hash(@action_4916953867006087388_3629301349604561982 );
        action_4916953867006087388_3629301349604561982.actionId = action_id_4916953867006087388_3629301349604561982;
        
        let destination = "Eli's Forge";
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
        let object_desc: ByteArray = "a dusty window set at chest height in the west wall";
        let td_id_b = h_util::str_hash(@object_desc);
        object_4916953867006087388.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_4916953867006087388, object_desc);

        
        // object 2400306486137228273// action 7672293217203074089
        let mut action_2400306486137228273_7672293217203074089 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Open,  
            dBitTxt: "the trap door, opens with a bang releasing a small puff of something troubling", enabled: false, 
            revertable: true, dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_2400306486137228273_7672293217203074089 = h_util::action_hash(@action_2400306486137228273_7672293217203074089 );
        action_2400306486137228273_7672293217203074089.actionId = action_id_2400306486137228273_7672293217203074089;
        
        let destination = "Eli's Basement";
        let mut object_2400306486137228273 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::None,
            matType: zrk::MaterialType::Wood,
            dirType: zrk::DirectionType::Down,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_2400306486137228273_7672293217203074089,],
            txtDefId: st::SETME 
        };

        let object_id_2400306486137228273 = h_util::obj_hash(@object_2400306486137228273); 
        object_2400306486137228273.objectId = object_id_2400306486137228273;
        let object_desc: ByteArray = "a wooden trap door, is set in the floor leading downwards";
        let td_id_b = h_util::str_hash(@object_desc);
        object_2400306486137228273.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_2400306486137228273, object_desc);

        
        // object 17975420477260050648// action 4600616935932793690
        let mut action_17975420477260050648_4600616935932793690 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Burn,  
            dBitTxt: "the hay bursts into blue, yellow and orange flames with a speed and a heat so intense that you jump back loosing some eyebrows and gaining a small bit of wee", enabled: false, 
            revertable: false, dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_17975420477260050648_4600616935932793690 = h_util::action_hash(@action_17975420477260050648_4600616935932793690 );
        action_17975420477260050648_4600616935932793690.actionId = action_id_17975420477260050648_4600616935932793690;
        
        // action 6511208778142832924
        let mut action_17975420477260050648_6511208778142832924 = Action{
            actionId: st::NONE, 
            actionType: zrk::ActionType::Soak,  
            dBitTxt: "the hay soaks up the volatile liquid with gusto, the air smells potent", enabled: true, 
            revertable: false, dBit: false, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_17975420477260050648_6511208778142832924 = h_util::action_hash(@action_17975420477260050648_6511208778142832924 );
        action_17975420477260050648_6511208778142832924.actionId = action_id_17975420477260050648_6511208778142832924;
        
        let mut object_17975420477260050648 = Object{
            objectId: st::SETME, 
            objType: zrk::ObjectType::Bale,
            matType: zrk::MaterialType::Hay,
            dirType: zrk::DirectionType::None,
            destId: st::NONE,
            objectActionIds: array![action_id_17975420477260050648_4600616935932793690,action_id_17975420477260050648_6511208778142832924,],
            txtDefId: st::SETME 
        };

        let object_id_17975420477260050648 = h_util::obj_hash(@object_17975420477260050648); 
        object_17975420477260050648.objectId = object_id_17975420477260050648;
        let object_desc: ByteArray = "a large dry bale of hay";
        let td_id_b = h_util::str_hash(@object_desc);
        object_17975420477260050648.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_17975420477260050648, object_desc);

        
        store_actions(w, array![action_10414226638441273874_4328927602301159032,]);
        action_4916953867006087388_3629301349604561982.affectsActionId = action_id_4916953867006087388_14604306511083742153;
        action_4916953867006087388_14604306511083742153.affectedByActionId = action_id_4916953867006087388_3629301349604561982;store_actions(w, array![action_4916953867006087388_14604306511083742153,action_4916953867006087388_3629301349604561982,]);
        action_2400306486137228273_7672293217203074089.affectedByActionId = action_id_17975420477260050648_4600616935932793690;action_17975420477260050648_6511208778142832924.affectsActionId = action_id_17975420477260050648_4600616935932793690;
        store_actions(w, array![action_2400306486137228273_7672293217203074089,]);
        action_17975420477260050648_4600616935932793690.affectsActionId = action_id_2400306486137228273_7672293217203074089;
        action_17975420477260050648_4600616935932793690.affectedByActionId = action_id_17975420477260050648_6511208778142832924;
        store_actions(w, array![action_17975420477260050648_4600616935932793690,action_17975420477260050648_6511208778142832924,]);
        store_objects(w, array![object_10414226638441273874]);store_objects(w, array![object_4916953867006087388]);store_objects(w, array![object_2400306486137228273]);store_objects(w, array![object_17975420477260050648]);// store_objects(w, array![object_10414226638441273874,object_4916953867006087388,object_2400306486137228273,object_17975420477260050648,]);
        
        // now store a room with all its shizzle
        let room_desc: ByteArray = "the barn is old and smells of old hay and oddly dissolution\nthe floor is dirt and trampled dried horse shit scattered with straw and broken bottles\nthe smell is not unpleasent and reminds you faintly of petrol and old socks";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Eli's Barn";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: zrk::RoomType::Barn,
            biomeType: zrk::BiomeType::Prarie,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![object_id_17975420477260050648,],
            dirObjIds: array![object_id_10414226638441273874,object_id_4916953867006087388,object_id_2400306486137228273,],
            players: array![]
        };

        // set main description text in world store
        // for the place/area/room
        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
        
    }}
