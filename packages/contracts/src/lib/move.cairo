
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod relocate {
    use dojo::world::{IWorldDispatcher, WorldStorage};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::models::{
        output::{Output}, 
        player::{Player}, 
        zrk_enums::{ActionType, ObjectType}, 
        room::{Room},
        object::{Object},
        action::{Action}
    };
    use the_oruggin_trail::constants::zrk_constants::{ErrCode as ec, statusid as st};
    use the_oruggin_trail::lib::{
        err_handler::err_dispatcher as err_dispatch, 
        look::lookat};
    use the_oruggin_trail::systems::tokeniser::{confessor::Garble};

    /// TODO:
    /// this should really live in the meatpuppet also it should
    /// probably return a string
    pub fn enter_room(mut world: WorldStorage, pid: felt252, rm_id: felt252) {
        let pid = 23;
        let mut player: Player = world.read_model(pid);
        player.location = rm_id;
        println!("ENTER_RM:-----> {:?}", rm_id);
        world.write_model(@player);
    }

    /// get the next room
    /// 
    /// we check if the exits contains the correct direction
    /// then if this direction is open and enabled
    /// 
    /// TODO
    /// we also nned to add checking for path/exit blocked by objects
    pub fn get_next_room(world: WorldStorage, pid: felt252, msg: Garble ) -> felt252 {
        let mut next_rm: felt252 = st::NONE;
        // fetch the room
        let pl: Player = world.read_model(pid);
        let curr_rm = pl.location.clone();
        let rm: Room = world.read_model(curr_rm);
        let exits: Array<felt252> = rm.dirObjIds.clone();
        // check for an exit
        _direction_check(world, exits, msg)
    }

    fn _direction_check(world: WorldStorage, exits: Array<felt252>, msg: Garble) -> felt252 {
        // get the exits from the room
        let mut idx: u32 = 0;
        let mut dest: felt252 = st::NONE;
        let mut canMove: bool = false;
        while idx < exits.len() {
            let exit_id = exits.at(idx).clone();
            let exit: Object = world.read_model(exit_id);
            if exit.dirType == msg.dir {
                // it it open/passable
                canMove = _can_move(world, @exit, msg);
                if canMove {
                    println!("can_move: -----> {:?}", exit.destId);
                    dest = exit.destId
                }
            }
            idx += 1;
        };
        dest
    }

    fn _can_move(world: WorldStorage, exit: @Object, msg: Garble) -> bool {
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