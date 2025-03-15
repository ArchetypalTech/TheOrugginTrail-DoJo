//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

/// The main Interface for the system
///
/// Exprected to take an array of str from an RPC call
/// and to then lex and extract semantic information
/// pre passing this information on to the rest
/// of the system.
#[starknet::interface]
pub trait IListener<T> {
    fn listen(ref self: T, cmd: Array<ByteArray>, _add: felt252);
}

/// Impl of the listener
/// acts as a main() and takes a command
/// which is then lexed and then has semantic
/// meaning extracted into a small struct
/// which can then be passed along to the next
/// logical block/system
#[dojo::contract]
pub mod meatpuppet {
    use starknet::{get_caller_address};
    use super::{IListener};
    use the_oruggin_trail::lib::command_handler;
    use the_oruggin_trail::models::{output::{Output}, player::{Player}, inventory::Inventory};
    use the_oruggin_trail::systems::tokeniser::{lexer};
    use the_oruggin_trail::actions::move::move;

    use the_oruggin_trail::constants::zrk_constants::ErrCode;
    use the_oruggin_trail::lib::err_handler::err_dispatcher;

    use dojo::model::{ModelStorage};
    use dojo::world::{WorldStorage};

    #[abi(embed_v0)]
    /// ListenImpl
    ///
    /// this needs a means of interogating the world to see
    /// if the player exists already and if not then we should
    /// spawn the player in the some defualt start location
    pub impl ListenImpl of IListener<ContractState> {
        fn listen(ref self: ContractState, cmd: Array<ByteArray>, _add: felt252) {
            let player_id: felt252 = get_caller_address().into();
            //! we use this as an error flag to kick us into error
            //! catching routines later as we run the parses over
            //! the command string

            let mut world: WorldStorage = self.world(@"the_oruggin_trail");

            // world.write_model(@Output{playerId: 23, text_o_vision: "..."});

            let mut isErr: ErrCode = ErrCode::None;
            let l_cmd = @cmd;
            let mut wrld_dispatcher = world.dispatcher;

            if (doesPlayerExist(world, player_id) == false) {
                createPlayer(world, player_id);
            }

            let mut player = getPlayer(world, player_id);

            match lexer::parse(l_cmd.clone(), world, player) {
                Result::Ok(result) => {
                    // we have a valid command so pass it into a handler routine
                    // this should really return err and a string
                    command_handler::handle(ref wrld_dispatcher, player, result);
                },
                Result::Err(_r) => {
                    // this should really return err and a string
                    err_dispatcher::error_handle(ref wrld_dispatcher, player_id, isErr);
                },
            }
        }
    }

    pub fn getPlayer(mut world_store: WorldStorage, player_id: felt252) -> Player {
        let address_player = get_caller_address();
        let player_id: felt252 = address_player.into();
        let mut player: Player = world_store.read_model(player_id);
        player
    }

    pub fn doesPlayerExist(mut world_store: WorldStorage, player_id: felt252) -> bool {
        let mut player: Player = getPlayer(world_store, player_id);
        if (player.location == 0) {
            return false;
        }
        true
    }

    pub fn createPlayer(mut world_store: WorldStorage, player_id: felt252) -> Player {
        let address_player = get_caller_address();
        let start_room = 7892581999139148;
        let mut new_player = Player {
            player_id: player_id,
            player_adr: address_player,
            location: start_room,
            inventory: player_id,
        };
        let inv = Inventory { owner_id: player_id, items: array![] };
        world_store.write_model(@inv);
        world_store.write_model(@new_player);
        move::set_player_location(world_store, new_player, start_room);
        let mut out: ByteArray = "You feel light in the head";
        world_store.write_model(@Output { playerId: player_id, text_o_vision: out });
        return new_player;
    }
}

