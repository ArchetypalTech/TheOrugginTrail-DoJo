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
    use super::{IListener};
    use the_oruggin_trail::lib::command_handler;
    use the_oruggin_trail::lib::world;
    use the_oruggin_trail::systems::tokeniser::{lexer};

    use the_oruggin_trail::constants::zrk_constants::ErrCode;
    use the_oruggin_trail::lib::err_handler::err_dispatcher;

    use dojo::world::{WorldStorage};

    #[abi(embed_v0)]
    pub impl ListenImpl of IListener<ContractState> {
        fn listen(ref self: ContractState, cmd: Array<ByteArray>, _add: felt252) {
            let mut world: WorldStorage = self.world(@"the_oruggin_trail");
            let mut isErr: ErrCode = ErrCode::None;
            let l_cmd = @cmd;
            let mut wrld_dispatcher = world.dispatcher;
            let player = world::initialize_caller(world);

            match lexer::parse(l_cmd.clone(), world, player) {
                Result::Ok(result) => {
                    // we have a valid command so pass it into a handler routine
                    // this should really return err and a string
                    command_handler::handle(ref wrld_dispatcher, player, result);
                },
                Result::Err(_r) => {
                    // this should really return err and a string
                    err_dispatcher::error_handle(ref wrld_dispatcher, player.player_id, isErr);
                },
            }
        }
    }
}

