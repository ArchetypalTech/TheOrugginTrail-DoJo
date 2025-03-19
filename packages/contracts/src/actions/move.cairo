pub mod move {
    use dojo::world::{WorldStorage};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::lib::world;
    use the_oruggin_trail::models::{player::{Player, PlayerImpl}, room::Room};
    use the_oruggin_trail::actions::look::lookat;
    use the_oruggin_trail::systems::tokeniser::{lexer::Garble};

    pub fn action_move(mut world: WorldStorage, message: Garble, player: Player) -> ByteArray {
        let mut out: ByteArray = "";
        let room: Room = world::getRoom(world, player);
        let destination_id = world::getRoomExitByDir(world, room, message.dir);
        if destination_id == 0 {
            out = "Can't go there";
        } else {
            let desc: ByteArray = lookat::describe_room_short(world, destination_id);
            player.move_to_room(world, destination_id);
            world.write_model(@player);
            out = desc;
        }
        out
    }
}
