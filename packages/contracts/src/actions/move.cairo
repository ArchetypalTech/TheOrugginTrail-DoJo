//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod move {
    use dojo::world::{ // IWorldDispatcher,
    WorldStorage};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::models::{
        player::{Player, PlayerTrait}, zrk_enums::{ActionType}, room::{Room}, object::{Object},
        action::{Action},
    };
    use the_oruggin_trail::constants::zrk_constants::{statusid};
    use the_oruggin_trail::systems::tokeniser::{lexer::Garble};
    use the_oruggin_trail::actions::look::lookat;
    use the_oruggin_trail::lib::world;

    /// TODO:
    /// this should really live in the meatpuppet also it should
    /// probably return a string
    pub fn action_move(mut world: WorldStorage, message: Garble, mut player: Player) -> ByteArray {
        let mut out: ByteArray = "";
        let nxt_rm_id = find_exit(world, player, message);
        if nxt_rm_id == statusid::NONE {
            out = "Can't go there"
        } else {
            let desc: ByteArray = lookat::describe_room_short(world, nxt_rm_id);
            player.move_to_room(world, nxt_rm_id);
            out = desc;
        }
        return out;
    }

    pub fn find_exit(world: WorldStorage, player: Player, message: Garble) -> felt252 {
        let room: Room = world::getRoom(world, player);
        let objects: Array<Object> = world::getRoomObjects(world, room);
        let mut destination = 0;
        for obj in objects {
            if destination != 0 {
                break;
            };
            if (obj.dirType != message.dir) {
                continue;
            }
            let actions = world::getObjectActions(world, obj.inst);
            for action in actions {
                if (action.actionType == ActionType::Open && action.enabled) {
                    destination = obj.destId;
                    break;
                };
            };
        };
        destination
    }
}
