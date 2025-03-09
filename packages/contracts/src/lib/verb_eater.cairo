//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod verb_dispatcher {
    use the_oruggin_trail::systems::tokeniser::confessor::{Garble};

    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use dojo::model::{ModelStorage};

    use the_oruggin_trail::actions::look::lookat;
    use the_oruggin_trail::actions::move::move;
    use the_oruggin_trail::actions::take::take;
    use the_oruggin_trail::actions::drop::drop;
    use the_oruggin_trail::actions::inventory::inventory;
    use the_oruggin_trail::lib::act::pullstrings;
    use the_oruggin_trail::models::{output::{Output}, player::{Player}, zrk_enums::{ActionType}};

    pub fn handleGarble(ref world: IWorldDispatcher, player: Player, msg: Garble) {
        let mut world_store: WorldStorage = WorldStorageTrait::new(world, @"the_oruggin_trail");
        println!("HNDL: ---> {:?}", msg.vrb);
        let mut out: ByteArray =
            "Shoggoth is loveable by default, but it understands not your commands";

        // Player exists, let's do stuff
        match msg.vrb {
            ActionType::Look => { out = lookat::action_look(world_store, msg, player); },
            ActionType::Fight => {
                let stub: ByteArray = "Shoggoth is a good boy, he will fight you";
                out = stub;
            },
            ActionType::Spawn => {
                let desc: ByteArray = lookat::describe_room_short(
                    world_store, player.location.clone(),
                );
                let stub: ByteArray =
                    "A thought has spawned in your mind, you can't quite make out what it is,";
                out = format!("{} {}", stub, desc);
            },
            ActionType::Inventory => {
                out = inventory::action_inventory_list(world_store, msg, player);
            },
            ActionType::Take => { out = take::action_take(world_store, msg, player); },
            ActionType::Drop => { out = drop::action_drop(world_store, msg, player); },
            ActionType::Move => { out = move::action_move(world_store, msg, player); },
            _ => { out = pullstrings::on(world, player.player_id, msg); },
        }
        // we probably need to hand off to another routine here to interpolate
        // some results and create a string for now though
        world_store.write_model(@Output { playerId: player.player_id, text_o_vision: out });
        // set!(world, Output { playerId: player_id, text_o_vision: out })
    }
}
