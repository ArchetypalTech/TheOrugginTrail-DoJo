//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod move {
    use dojo::world::{ // IWorldDispatcher,
    WorldStorage};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::models::{
        player::{Player}, zrk_enums::{ActionType}, room::{Room}, object::{Object}, action::{Action},
    };
    use the_oruggin_trail::constants::zrk_constants::{statusid};
    use the_oruggin_trail::systems::tokeniser::{lexer::Garble};
    use the_oruggin_trail::actions::look::lookat;

    /// TODO:
    /// this should really live in the meatpuppet also it should
    /// probably return a string
    pub fn action_move(mut world: WorldStorage, message: Garble, mut player: Player) -> ByteArray {
        let mut out: ByteArray = "";
        let nxt_rm_id = get_next_room(world, player, message);
        if nxt_rm_id == statusid::NONE {
            // let nopes: Array<ByteArray> = array!["Can't go there", "You can't go there", "No
            // way", "Nope."];
            out = "Can't go there"
        } else {
            let desc: ByteArray = lookat::describe_room_short(world, nxt_rm_id);
            set_player_location(world, player, nxt_rm_id);
            out = desc;
        }
        return out;
    }

    pub fn set_player_location(mut world: WorldStorage, mut player: Player, room_id: felt252) {
        //TODO: check if room exists
        player.location = room_id;
        println!("ENTER_RM:-----> {:?}", room_id);
        world.write_model(@player);
    }

    /// get the next room
    ///
    /// we check if the exits contains the correct direction
    /// then if this direction is open and enabled
    ///
    /// TODO
    /// we also nned to add checking for path/exit blocked by objects
    pub fn get_next_room(world: WorldStorage, player: Player, message: Garble) -> felt252 {
        // fetch the room
        let curr_rm = player.location;
        let rm: Room = world.read_model(curr_rm);
        let exits: Array<felt252> = rm.objectIds.clone();
        // check for an exit
        _direction_check(world, exits, message)
    }

    fn _direction_check(world: WorldStorage, exits: Array<felt252>, message: Garble) -> felt252 {
        // get the exits from the room
        let mut idx: u32 = 0;
        let mut dest: felt252 = statusid::NONE;
        let mut canMove: bool = false;
        while idx < exits.len() {
            let exit_id = exits.at(idx).clone();
            let exit: Object = world.read_model(exit_id);
            if exit.dirType == message.dir {
                // it it open/passable
                canMove = _can_move(world, @exit, message);
                if canMove {
                    println!("can_move: -----> {:?}", exit.destId);
                    dest = exit.destId
                }
            }
            idx += 1;
        };
        dest
    }

    fn _can_move(world: WorldStorage, exit: @Object, message: Garble) -> bool {
        // get the actions and look for open
        let mut idx: u32 = 0;
        let mut canMove: bool = false;
        let action_ids: Array<felt252> = exit.objectActionIds.clone();
        while idx < action_ids.len() {
            let action_id = action_ids.at(idx).clone();
            let action: Action = world.read_model(action_id);
            if action.actionType == ActionType::Open {
                // it it enabled
                canMove = action.enabled
            }
            idx += 1;
        };
        canMove
    }
}
