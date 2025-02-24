
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod verb_dispatcher {
    // use the_oruggin_trail::lib::interop_dispatch::interop_dispatcher as interop;
    use the_oruggin_trail::lib::system::{
        WorldSystemsTrait
    };

    use the_oruggin_trail::systems::spawner::{ISpawner, ISpawnerDispatcher, ISpawnerDispatcherTrait};
    use the_oruggin_trail::systems::tokeniser::confessor::{Garble};
    
    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use dojo::model::{ModelStorage};
    
    use the_oruggin_trail::lib::look::lookat;
    use the_oruggin_trail::lib::move::relocate as mv;
    use the_oruggin_trail::lib::act::pullstrings as act;
    use the_oruggin_trail::models::{
        output::{Output}, player::{Player}, room::{Room}, object::{Object}, inventory::{Inventory},
        zrk_enums::{ActionType, ObjectType, object_type_to_str}
    };
    use the_oruggin_trail::constants::zrk_constants::{statusid as st};
    use the_oruggin_trail::lib::hash_utils::hashutils as h_util;

    pub fn handleGarble(ref world: IWorldDispatcher, pid: felt252, msg: Garble) {
        let mut wrld: WorldStorage =  WorldStorageTrait::new(world, @"the_oruggin_trail");
        println!("HNDL: ---> {:?}", msg.vrb);
        let mut out: ByteArray =
            "Shoggoth is loveable by default, but it understands not your commands";
        let mut player: Player = wrld.read_model(pid);
        // println!("HNDL:------> {:?}", player);
        match msg.vrb {
            ActionType::Look => {
                // Pass payer id into look handle
                // let output: ByteArray = "Shoggoth stares into the void<\n>the void is staring
                // back<\n>shoggoth is a good boy";
                let output: ByteArray = lookat::stuff(world, msg, pid);
                out = output;
            },
            ActionType::Fight => {
                // println!("starting a FIGHT. like a MAN");
                // i_out = interop::kick_off(@world);
                let stub: ByteArray = "Shoggoth is a good boy, he will fight you";
                // out = i_out;
                out = stub;
            },
            ActionType::Spawn => {
                let (contract_address, class_hash) = match wrld.dns(@"spawner") {
                    Option::Some((addr, hash)) => (addr, hash),
                    Option::None => panic!("Contract not found")
                };

                let spawner: ISpawnerDispatcher = world.spawner_dispatcher();

                if player.location == 0 {
                    spawner.setup();
                    // println!("spawned????");
                    let spawn_rm_name: ByteArray = "Walking Eagle Pass";
                    let spawn_id = h_util::str_hash(@spawn_rm_name);
                    spawner.spawn_player(pid, 0);
                    mv::enter_room(wrld, pid, spawn_id);
                    let desc: ByteArray = lookat::describe_room_short(wrld, spawn_id);
                    out = desc;
                }else {
                    let desc: ByteArray = "you already did that. stop this foolishness";
                    out = desc;
                }
            },
            ActionType::Take => {
                println!("take------->{:?}", msg);
                let mut desc: ByteArray = "";
                if msg.dobj == ObjectType::None {
                    // let item_desc: ByteArray = object_type_to_str(msg.dobj);
                    desc = "hmmm, there isnt one of those here to take. are you mad fam?";
                } else {
                    let mut rm: Room = wrld.read_model(player.location.clone());
                    let mut obj_ids: Array<felt252> = rm.objectIds.clone();
                    let mut new_obj_ids: Array<felt252> = array![];
                    let mut inv: Inventory = wrld.read_model(player.inventory.clone());
                    // let mut found: bool = false;
                    println!("objs {:?}", obj_ids.len());
                    for ele in obj_ids {
                        let obj: Object = wrld.read_model(ele);
                        println!("{:?}", obj.objType);
                        if obj.objType == msg.dobj {
                            // found = true;
                            println!("found thing");
                            inv.items.append(obj.objectId);
                            let item_desc: ByteArray = object_type_to_str(obj.objType);
                            desc =
                                format!(
                                    "you put the {} in your trusty adventurors plastic bag",
                                    item_desc
                                );
                        } else {
                            new_obj_ids.append(ele);
                        }
                    };

                    rm.objectIds = new_obj_ids;
                    wrld.write_model(@rm);
                    wrld.write_model(@inv);
                }
                out = desc;
            },
            ActionType::Drop => {
                println!("drop------->{:?}", msg);
                let mut desc: ByteArray = "";
                if msg.dobj == ObjectType::None {
                    // let item_desc: ByteArray = object_type_to_str(msg.dobj);
                    desc = "hmmm, there isnt one of those here to drop. are you mad fam?";
                }else {
                    let mut rm: Room = wrld.read_model(player.location.clone());
                    let mut inv: Inventory = wrld.read_model(player.inventory.clone());
                    let mut new_inv_items: Array<felt252> = array![]; // New inventory without the dropped item
                    let mut found: bool = false;
                    println!("inv items {:?}", inv.items.len());
                    for ele in inv.items {
                        let obj: Object = wrld.read_model(ele);
                        println!("{:?}", obj.objType);
                        if obj.objType == msg.dobj && !found {
                            println!("dropping thing");
                            rm.objectIds.append(obj.objectId);
                            let item_desc: ByteArray = object_type_to_str(obj.objType);
                            desc =
                                format!(
                                    "you drop the {} from your trusty adventurors plastic bag",
                                    item_desc
                                );
                            found = true;
                        } else {
                            new_inv_items.append(ele);
                        }
                    };

                    if !found {
                        desc = "you don't have one of those to drop.";
                    }

                    inv.items = new_inv_items; // Update inventory
                    wrld.write_model(@rm);
                    wrld.write_model(@inv);
                }
                out = desc;
            },
            ActionType::Help => {
                // println!("help------>");
                let txt: ByteArray =
                    "there is little time\nwaste not time on \"I do thing\"\njust type \"do thing\"\ngo north, take ball, look around, fight the power, go to the north, sniff all the glue etc\nthere is no time...\nno time";
                out = txt;
            },
            ActionType::Move => {
                let nxt_rm_id = mv::get_next_room(wrld, pid, msg);
                if nxt_rm_id == st::NONE {
                    out =
                        "no. you cannot go that way.\n\"reasons\" mumbles shoggoth into his hat\n she seems to be waving a hand shaped thing"
                } else {
                    mv::enter_room(wrld, pid, nxt_rm_id);
                    let desc: ByteArray = lookat::describe_room_short(wrld, nxt_rm_id);
                    out = desc;
                }
            },
            _ => { out = act::on(world, pid, msg); },
        }
        // we probably need to hand off to another routine here to interpolate
        // some results and create a string for now though
        wrld.write_model(@Output{playerId: pid, text_o_vision: out});
        // set!(world, Output { playerId: pid, text_o_vision: out })
    }
}
