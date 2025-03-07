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
        zrk_enums as zrk, txtdef::{Txtdef}, action::{Action}, object::{Object}, room::{Room},
        player::{Player}, inventory::{Inventory},
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
            // make_rooms(world.dispatcher);
        }

        fn spawn_player(ref self: ContractState, pid: felt252, start_room: felt252) {
            let player = Player {
                player_id: pid, player_adr: OTHER(), location: start_room, inventory: pid,
            };

            let mut world = self.world(@"the_oruggin_trail");
            let inv = Inventory { owner_id: pid, items: array![] };
            world.write_model(@inv);
            world.write_model(@player);
        }
    }

    fn OTHER() -> ContractAddress {
        starknet::contract_address_const::<0x2>()
    }

    fn store_objects(w: IWorldDispatcher, t: Array<Object>) {
        let mut world: WorldStorage = WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_actions(w: IWorldDispatcher, t: Array<Action>) {
        let mut world: WorldStorage = WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_places(w: IWorldDispatcher, t: Array<Room>) {
        let mut world: WorldStorage = WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_txt(world: IWorldDispatcher, id: felt252, ownedBy: felt252, val: ByteArray) {
        let mut world: WorldStorage = WorldStorageTrait::new(world, @"the_oruggin_trail");
        world.write_model(@Txtdef { id: id, owner: ownedBy, text: val });
    }


    fn make_rooms(w: IWorldDispatcher) {
        let _ = gen_room_7892581999139148000(w);
        let _ = gen_room_8892581999139148000(w);
        let _ = gen_room_2103159215482208000(w);
        let _ = gen_room_11107137240536498000(w);
        let _ = gen_room_13246886194600585000(w);
    }


    fn gen_room_7892581999139148000(w: IWorldDispatcher) {
        let mut action_215772409139972100_21833044636746870000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Open,
            dBitTxt: "the path winds west, it is open, and you hear a faint echo",
            enabled: true,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_215772409139972100_21833044636746870000 = h_util::action_hash(
            @action_215772409139972100_21833044636746870000,
        );
        action_215772409139972100_21833044636746870000
            .actionId = action_id_215772409139972100_21833044636746870000;

        let destination = "The Burning Planes";
        let mut object_215772409139972100 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Bale,
            matType: zrk::MaterialType::Dirt,
            dirType: zrk::DirectionType::West,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_215772409139972100_21833044636746870000],
            txtDefId: st::SETME,
        };

        let object_id_215772409139972100 = h_util::obj_hash(@object_215772409139972100);
        object_215772409139972100.objectId = object_id_215772409139972100;
        let object_desc: ByteArray = "Something bubbles and echoes towards your west";
        let td_id_b = h_util::str_hash(@object_desc);
        object_215772409139972100.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_215772409139972100, object_desc);

        let mut action_445772409139972100_95996044636746870000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Pray,
            dBitTxt: "Go, what are you waiting for..",
            enabled: true,
            revertable: true,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_445772409139972100_95996044636746870000 = h_util::action_hash(
            @action_445772409139972100_95996044636746870000,
        );
        action_445772409139972100_95996044636746870000
            .actionId = action_id_445772409139972100_95996044636746870000;

        let mut action_445772409139972100_25996044636746870000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Look,
            dBitTxt: "Jacob looks back at you, you hear him thinking 'what are you waiting for', don't pray to me.",
            enabled: true,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_445772409139972100_25996044636746870000 = h_util::action_hash(
            @action_445772409139972100_25996044636746870000,
        );
        action_445772409139972100_25996044636746870000
            .actionId = action_id_445772409139972100_25996044636746870000;

        let destination = "The Alley Off Main Street";
        let mut object_445772409139972100 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Window,
            matType: zrk::MaterialType::None,
            dirType: zrk::DirectionType::West,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![
                action_id_445772409139972100_95996044636746870000,
                action_id_445772409139972100_25996044636746870000,
            ],
            txtDefId: st::SETME,
        };

        let object_id_445772409139972100 = h_util::obj_hash(@object_445772409139972100);
        object_445772409139972100.objectId = object_id_445772409139972100;
        let object_desc: ByteArray =
            "Jacob, he's standing waiting for you to step through the Echo in the west";
        let td_id_b = h_util::str_hash(@object_desc);
        object_445772409139972100.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_445772409139972100, object_desc);

        action_445772409139972100_95996044636746870000
            .affectsActionId = action_id_445772409139972100_95996044636746870000;
        action_445772409139972100_95996044636746870000
            .affectedByActionId = action_id_445772409139972100_95996044636746870000;

        action_445772409139972100_25996044636746870000
            .affectsActionId = action_id_445772409139972100_95996044636746870000;
        action_445772409139972100_95996044636746870000
            .affectedByActionId = action_id_445772409139972100_25996044636746870000;
        store_actions(w, array![action_215772409139972100_21833044636746870000]);
        store_actions(
            w,
            array![
                action_445772409139972100_95996044636746870000,
                action_445772409139972100_25996044636746870000,
            ],
        );
        store_objects(w, array![object_215772409139972100]);
        store_objects(w, array![object_445772409139972100]);

        let room_desc: ByteArray =
            "The neon sign flickered weakly against the dying light of the final stars.
 The establishment sat at the very edge of existence, where the universe's expansion had stretched reality thin as a piece of cosmic taffy.";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "The Last Saloon";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room {
            roomId: rmid,
            roomType: zrk::RoomType::Mountains,
            biomeType: zrk::BiomeType::Mountains,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![],
            dirObjIds: array![object_id_215772409139972100, object_id_445772409139972100],
            players: array![],
        };

        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
    }


    fn gen_room_8892581999139148000(w: IWorldDispatcher) {
        let mut action_745772409139972100_14833044636746870000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Open,
            dBitTxt: "the path winds west, it is open",
            enabled: true,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_745772409139972100_14833044636746870000 = h_util::action_hash(
            @action_745772409139972100_14833044636746870000,
        );
        action_745772409139972100_14833044636746870000
            .actionId = action_id_745772409139972100_14833044636746870000;

        let destination = "Walking Eagle Pass";
        let mut object_745772409139972100 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Dirt,
            dirType: zrk::DirectionType::West,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_745772409139972100_14833044636746870000],
            txtDefId: st::SETME,
        };

        let object_id_745772409139972100 = h_util::obj_hash(@object_745772409139972100);
        object_745772409139972100.objectId = object_id_745772409139972100;
        let object_desc: ByteArray = "path leading west";
        let td_id_b = h_util::str_hash(@object_desc);
        object_745772409139972100.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_745772409139972100, object_desc);

        let mut action_14833044636746870000_7479341928096535000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Open,
            dBitTxt: "the path winds west, it is open",
            enabled: true,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_14833044636746870000_7479341928096535000 = h_util::action_hash(
            @action_14833044636746870000_7479341928096535000,
        );
        action_14833044636746870000_7479341928096535000
            .actionId = action_id_14833044636746870000_7479341928096535000;

        let destination = "The Last Saloon";
        let mut object_14833044636746870000 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Metal,
            dirType: zrk::DirectionType::South,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_14833044636746870000_7479341928096535000],
            txtDefId: st::SETME,
        };

        let object_id_14833044636746870000 = h_util::obj_hash(@object_14833044636746870000);
        object_14833044636746870000.objectId = object_id_14833044636746870000;
        let object_desc: ByteArray = "Train";
        let td_id_b = h_util::str_hash(@object_desc);
        object_14833044636746870000.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_14833044636746870000, object_desc);

        let mut action_7479341928096535000_9807140808976005000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Open,
            dBitTxt: "the path winds east, through piles of fresh rubble and charred pine cones",
            enabled: false,
            revertable: false,
            dBit: false,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_7479341928096535000_9807140808976005000 = h_util::action_hash(
            @action_7479341928096535000_9807140808976005000,
        );
        action_7479341928096535000_9807140808976005000
            .actionId = action_id_7479341928096535000_9807140808976005000;

        let destination = "The Alley Off Main Street";
        let mut object_7479341928096535000 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Dirt,
            dirType: zrk::DirectionType::East,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_7479341928096535000_9807140808976005000],
            txtDefId: st::SETME,
        };

        let object_id_7479341928096535000 = h_util::obj_hash(@object_7479341928096535000);
        object_7479341928096535000.objectId = object_id_7479341928096535000;
        let object_desc: ByteArray = "path leading east";
        let td_id_b = h_util::str_hash(@object_desc);
        object_7479341928096535000.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_7479341928096535000, object_desc);

        let mut action_383324005557581440_5294932446722203000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Disintegrate,
            dBitTxt: "the boulder shatters into dust and shrapnel,
pieces fly,
deer run startled,
cows drop dead,
crows and squirrels drop out of the sky.
satisfying essentially.
a small fly takes a dump in your ear. you don't notice this luckily.",
            enabled: true,
            revertable: false,
            dBit: false,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_383324005557581440_5294932446722203000 = h_util::action_hash(
            @action_383324005557581440_5294932446722203000,
        );
        action_383324005557581440_5294932446722203000
            .actionId = action_id_383324005557581440_5294932446722203000;

        let mut object_383324005557581440 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Boulder,
            matType: zrk::MaterialType::Stone,
            dirType: zrk::DirectionType::None,
            destId: st::NONE,
            objectActionIds: array![action_id_383324005557581440_5294932446722203000],
            txtDefId: st::SETME,
        };

        let object_id_383324005557581440 = h_util::obj_hash(@object_383324005557581440);
        object_383324005557581440.objectId = object_id_383324005557581440;
        let object_desc: ByteArray =
            "a huge boulder blocks the pass east,
it is full of the stony remains of creatures designed by an easily bored god and then discarded.
darwin may have some thoughts on this.
someone has drawn a cock on it.";
        let td_id_b = h_util::str_hash(@object_desc);
        object_383324005557581440.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_383324005557581440, object_desc);

        let mut object_2482204884394581 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Chest,
            matType: zrk::MaterialType::IKEA,
            dirType: zrk::DirectionType::South,
            destId: st::NONE,
            objectActionIds: array![],
            txtDefId: st::SETME,
        };

        let object_id_2482204884394581 = h_util::obj_hash(@object_2482204884394581);
        object_2482204884394581.objectId = object_id_2482204884394581;
        let object_desc: ByteArray = "Backpack";
        let td_id_b = h_util::str_hash(@object_desc);
        object_2482204884394581.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_2482204884394581, object_desc);

        action_383324005557581440_5294932446722203000
            .affectsActionId = action_id_7479341928096535000_9807140808976005000;
        action_7479341928096535000_9807140808976005000
            .affectedByActionId = action_id_383324005557581440_5294932446722203000;
        store_actions(w, array![action_745772409139972100_14833044636746870000]);
        store_actions(w, array![action_14833044636746870000_7479341928096535000]);
        store_actions(w, array![action_7479341928096535000_9807140808976005000]);
        store_actions(w, array![action_383324005557581440_5294932446722203000]);
        store_actions(w, array![]);
        store_objects(w, array![object_745772409139972100]);
        store_objects(w, array![object_14833044636746870000]);
        store_objects(w, array![object_7479341928096535000]);
        store_objects(w, array![object_383324005557581440]);
        store_objects(w, array![object_2482204884394581]);

        let room_desc: ByteArray =
            "winged wreckages are strewn across the planes
either they landed embracing another or
otherwise tumbled under and over

skeletons of passengers, their belongings
a backpack gives some color";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "The Burning Planes";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room {
            roomId: rmid,
            roomType: zrk::RoomType::Mountains,
            biomeType: zrk::BiomeType::Mountains,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![object_id_383324005557581440, object_id_2482204884394581],
            dirObjIds: array![
                object_id_745772409139972100,
                object_id_14833044636746870000,
                object_id_7479341928096535000,
            ],
            players: array![],
        };

        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
    }


    fn gen_room_2103159215482208000(w: IWorldDispatcher) {
        let mut action_16637690103936120000_17581850991508748000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Open,
            dBitTxt: "the path winds west",
            enabled: true,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_16637690103936120000_17581850991508748000 = h_util::action_hash(
            @action_16637690103936120000_17581850991508748000,
        );
        action_16637690103936120000_17581850991508748000
            .actionId = action_id_16637690103936120000_17581850991508748000;

        let destination = "Walking Eagle Pass";
        let mut object_16637690103936120000 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Path,
            matType: zrk::MaterialType::Shit,
            dirType: zrk::DirectionType::North,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_16637690103936120000_17581850991508748000],
            txtDefId: st::SETME,
        };

        let object_id_16637690103936120000 = h_util::obj_hash(@object_16637690103936120000);
        object_16637690103936120000.objectId = object_id_16637690103936120000;
        let object_desc: ByteArray = "path";
        let td_id_b = h_util::str_hash(@object_desc);
        object_16637690103936120000.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_16637690103936120000, object_desc);

        store_actions(w, array![action_16637690103936120000_17581850991508748000]);
        store_objects(w, array![object_16637690103936120000]);

        let room_desc: ByteArray =
            "the alley composed of stinking mud sits between main street and the praries, seems that
the town uses uses it as dump, for both discarded humans and discarded, well, literal shit.
all in all not somewhere wants to linger unless dead, or drunk and in that case probably
best to be dead drunk.
oddly it reminds you of home. this isnt a good thing.";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "The Alley Off Main Street";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room {
            roomId: rmid,
            roomType: zrk::RoomType::Alley,
            biomeType: zrk::BiomeType::Prarie,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![],
            dirObjIds: array![object_id_16637690103936120000],
            players: array![],
        };

        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
    }


    fn gen_room_11107137240536498000(w: IWorldDispatcher) {
        let mut action_10414226638441273000_4328927602301159000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Open,
            dBitTxt: "the door, closes with a creak",
            enabled: true,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_10414226638441273000_4328927602301159000 = h_util::action_hash(
            @action_10414226638441273000_4328927602301159000,
        );
        action_10414226638441273000_4328927602301159000
            .actionId = action_id_10414226638441273000_4328927602301159000;

        let destination = "Walking Eagle Pass";
        let mut object_10414226638441273000 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Door,
            matType: zrk::MaterialType::Wood,
            dirType: zrk::DirectionType::South,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_10414226638441273000_4328927602301159000],
            txtDefId: st::SETME,
        };

        let object_id_10414226638441273000 = h_util::obj_hash(@object_10414226638441273000);
        object_10414226638441273000.objectId = object_id_10414226638441273000;
        let object_desc: ByteArray = "an old wooden barn door, leads south";
        let td_id_b = h_util::str_hash(@object_desc);
        object_10414226638441273000.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_10414226638441273000, object_desc);

        let mut action_4916953867006087000_14604306511083741000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Open,
            dBitTxt: "the window, now broken, falls open",
            enabled: true,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_4916953867006087000_14604306511083741000 = h_util::action_hash(
            @action_4916953867006087000_14604306511083741000,
        );
        action_4916953867006087000_14604306511083741000
            .actionId = action_id_4916953867006087000_14604306511083741000;

        let mut action_4916953867006087000_3629301349604562000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Break,
            dBitTxt: "the window, smashes, glass flies everywhere, very very satisfying",
            enabled: true,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_4916953867006087000_3629301349604562000 = h_util::action_hash(
            @action_4916953867006087000_3629301349604562000,
        );
        action_4916953867006087000_3629301349604562000
            .actionId = action_id_4916953867006087000_3629301349604562000;

        let destination = "Eli's Basement";
        let mut object_4916953867006087000 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Window,
            matType: zrk::MaterialType::Glass,
            dirType: zrk::DirectionType::West,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![
                action_id_4916953867006087000_14604306511083741000,
                action_id_4916953867006087000_3629301349604562000,
            ],
            txtDefId: st::SETME,
        };

        let object_id_4916953867006087000 = h_util::obj_hash(@object_4916953867006087000);
        object_4916953867006087000.objectId = object_id_4916953867006087000;
        let object_desc: ByteArray = "a dusty window set at chest height in the west wall";
        let td_id_b = h_util::str_hash(@object_desc);
        object_4916953867006087000.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_4916953867006087000, object_desc);

        let mut action_2400306486137228300_7672293217203074000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Open,
            dBitTxt: "the trap door, opens with a bang releasing a small puff of something troubling",
            enabled: false,
            revertable: true,
            dBit: false,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_2400306486137228300_7672293217203074000 = h_util::action_hash(
            @action_2400306486137228300_7672293217203074000,
        );
        action_2400306486137228300_7672293217203074000
            .actionId = action_id_2400306486137228300_7672293217203074000;

        let destination = "Eli's Basement";
        let mut object_2400306486137228300 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Door,
            matType: zrk::MaterialType::Wood,
            dirType: zrk::DirectionType::Down,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_2400306486137228300_7672293217203074000],
            txtDefId: st::SETME,
        };

        let object_id_2400306486137228300 = h_util::obj_hash(@object_2400306486137228300);
        object_2400306486137228300.objectId = object_id_2400306486137228300;
        let object_desc: ByteArray = "a wooden trap door, is set in the floor leading downwards";
        let td_id_b = h_util::str_hash(@object_desc);
        object_2400306486137228300.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_2400306486137228300, object_desc);

        let mut action_17975420477260050000_4600616935932794000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Burn,
            dBitTxt: "the hay bursts into blue, yellow and orange flames with a speed and a heat so intense that you jump back loosing some eyebrows and gaining a small bit of wee",
            enabled: false,
            revertable: false,
            dBit: false,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_17975420477260050000_4600616935932794000 = h_util::action_hash(
            @action_17975420477260050000_4600616935932794000,
        );
        action_17975420477260050000_4600616935932794000
            .actionId = action_id_17975420477260050000_4600616935932794000;

        let mut action_17975420477260050000_6511208778142833000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Soak,
            dBitTxt: "the hay soaks up the volatile liquid with gusto, the air smells potent",
            enabled: true,
            revertable: false,
            dBit: false,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_17975420477260050000_6511208778142833000 = h_util::action_hash(
            @action_17975420477260050000_6511208778142833000,
        );
        action_17975420477260050000_6511208778142833000
            .actionId = action_id_17975420477260050000_6511208778142833000;

        let mut object_17975420477260050000 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Bale,
            matType: zrk::MaterialType::Hay,
            dirType: zrk::DirectionType::None,
            destId: st::NONE,
            objectActionIds: array![
                action_id_17975420477260050000_4600616935932794000,
                action_id_17975420477260050000_6511208778142833000,
            ],
            txtDefId: st::SETME,
        };

        let object_id_17975420477260050000 = h_util::obj_hash(@object_17975420477260050000);
        object_17975420477260050000.objectId = object_id_17975420477260050000;
        let object_desc: ByteArray = "a large dry bale of hay";
        let td_id_b = h_util::str_hash(@object_desc);
        object_17975420477260050000.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_17975420477260050000, object_desc);

        action_4916953867006087000_3629301349604562000
            .affectsActionId = action_id_4916953867006087000_14604306511083741000;
        action_4916953867006087000_14604306511083741000
            .affectedByActionId = action_id_4916953867006087000_3629301349604562000;

        action_17975420477260050000_4600616935932794000
            .affectsActionId = action_id_2400306486137228300_7672293217203074000;
        action_2400306486137228300_7672293217203074000
            .affectedByActionId = action_id_17975420477260050000_4600616935932794000;

        action_17975420477260050000_6511208778142833000
            .affectsActionId = action_id_17975420477260050000_4600616935932794000;
        action_17975420477260050000_4600616935932794000
            .affectedByActionId = action_id_17975420477260050000_6511208778142833000;
        store_actions(w, array![action_10414226638441273000_4328927602301159000]);
        store_actions(
            w,
            array![
                action_4916953867006087000_14604306511083741000,
                action_4916953867006087000_3629301349604562000,
            ],
        );
        store_actions(w, array![action_2400306486137228300_7672293217203074000]);
        store_actions(
            w,
            array![
                action_17975420477260050000_4600616935932794000,
                action_17975420477260050000_6511208778142833000,
            ],
        );
        store_objects(w, array![object_10414226638441273000]);
        store_objects(w, array![object_4916953867006087000]);
        store_objects(w, array![object_2400306486137228300]);
        store_objects(w, array![object_17975420477260050000]);

        let room_desc: ByteArray =
            "the barn is old and smells of old hay and oddly dissolution
the floor is dirt and trampled dried horse shit scattered with straw and broken bottles
the smell is not unpleasent and reminds you faintly of petrol and old socks";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Eli's Barn";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room {
            roomId: rmid,
            roomType: zrk::RoomType::Barn,
            biomeType: zrk::BiomeType::Prarie,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![object_id_17975420477260050000],
            dirObjIds: array![
                object_id_10414226638441273000,
                object_id_4916953867006087000,
                object_id_2400306486137228300,
            ],
            players: array![],
        };

        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
    }


    fn gen_room_13246886194600585000(w: IWorldDispatcher) {
        let mut action_4405246086034713600_16332049259031097000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Open,
            dBitTxt: "the trap door, closes with a bang",
            enabled: true,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_4405246086034713600_16332049259031097000 = h_util::action_hash(
            @action_4405246086034713600_16332049259031097000,
        );
        action_4405246086034713600_16332049259031097000
            .actionId = action_id_4405246086034713600_16332049259031097000;

        let destination = "Eli's Barn";
        let mut object_4405246086034713600 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Door,
            matType: zrk::MaterialType::Wood,
            dirType: zrk::DirectionType::Up,
            destId: h_util::str_hash(@destination),
            objectActionIds: array![action_id_4405246086034713600_16332049259031097000],
            txtDefId: st::SETME,
        };

        let object_id_4405246086034713600 = h_util::obj_hash(@object_4405246086034713600);
        object_4405246086034713600.objectId = object_id_4405246086034713600;
        let object_desc: ByteArray = "a slightly charcoaled wooden trap door, leads upwards";
        let td_id_b = h_util::str_hash(@object_desc);
        object_4405246086034713600.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_4405246086034713600, object_desc);

        let mut action_15610790850353037000_12578911564611470000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Explode,
            dBitTxt: "the dynamite detonates, you are lucky, the blast wave passes through you, you shit your pants involuntarily, you are spared the clean up by dint of now being largely composed of meaty paste.",
            enabled: false,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_15610790850353037000_12578911564611470000 = h_util::action_hash(
            @action_15610790850353037000_12578911564611470000,
        );
        action_15610790850353037000_12578911564611470000
            .actionId = action_id_15610790850353037000_12578911564611470000;

        let mut action_15610790850353037000_6636732390253037000 = Action {
            actionId: st::NONE,
            actionType: zrk::ActionType::Light,
            dBitTxt: "the fuse comes into menacing life, sparkling like a demented god, the air fills with the smell of gunpowder, its not at all unpleasant",
            enabled: true,
            revertable: false,
            dBit: true,
            affectsActionId: 0,
            affectedByActionId: 0,
        };

        let action_id_15610790850353037000_6636732390253037000 = h_util::action_hash(
            @action_15610790850353037000_6636732390253037000,
        );
        action_15610790850353037000_6636732390253037000
            .actionId = action_id_15610790850353037000_6636732390253037000;

        let mut object_15610790850353037000 = Object {
            objectId: st::SETME,
            objType: zrk::ObjectType::Dynamite,
            matType: zrk::MaterialType::TNT,
            dirType: zrk::DirectionType::None,
            destId: st::NONE,
            objectActionIds: array![
                action_id_15610790850353037000_12578911564611470000,
                action_id_15610790850353037000_6636732390253037000,
            ],
            txtDefId: st::SETME,
        };

        let object_id_15610790850353037000 = h_util::obj_hash(@object_15610790850353037000);
        object_15610790850353037000.objectId = object_id_15610790850353037000;
        let object_desc: ByteArray =
            "a stick of slightly sweaty dynamite almost like a caricature ot itself. It's fused and certainly unstable and capable of turning things including you into a fine meaty mist still holding exciteable explosives couldn't hurt right?";
        let td_id_b = h_util::str_hash(@object_desc);
        object_15610790850353037000.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_15610790850353037000, object_desc);

        store_actions(w, array![action_4405246086034713600_16332049259031097000]);
        store_actions(
            w,
            array![
                action_15610790850353037000_12578911564611470000,
                action_15610790850353037000_6636732390253037000,
            ],
        );
        store_objects(w, array![object_4405246086034713600]);
        store_objects(w, array![object_15610790850353037000]);

        let room_desc: ByteArray =
            "the basement is a converted root cellar, with a small stool bolted to the floor
it is not a comforting room and reminds you of far to many movies that you probably never should have watched
the light is just enough that you don't have to see too much.
it smells damp and somehow of bad faith.";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "Eli's Basement";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room {
            roomId: rmid,
            roomType: zrk::RoomType::Basement,
            biomeType: zrk::BiomeType::Prarie,
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![object_id_15610790850353037000],
            dirObjIds: array![object_id_4405246086034713600],
            players: array![],
        };

        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
    }
}
