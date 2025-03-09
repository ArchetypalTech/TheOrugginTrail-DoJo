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
    fn listen(ref self: T, cmd: Array<ByteArray>, p_id: felt252);

    // for interop with other worlds but doesnt have to be, could just be listen
    // but it sounds cooler
    fn command_shoggoth(ref self: T, victim: felt252, wish: Array<ByteArray>) -> ByteArray;
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
    use the_oruggin_trail::lib::verb_eater::verb_dispatcher;
    use the_oruggin_trail::models::{output::{Output}};
    use the_oruggin_trail::systems::tokeniser::{confessor // , confessor::Garble
    };

    use the_oruggin_trail::constants::zrk_constants::ErrCode;
    use the_oruggin_trail::lib::err_handler::err_dispatcher;

    use dojo::model::{ModelStorage // , ModelValueStorage
    };
    use dojo::world::{ // IWorldDispatcher,
    WorldStorage};

    #[abi(embed_v0)]
    /// ListenImpl
    ///
    /// this needs a means of interogating the world to see
    /// if the player exists already and if not then we should
    /// spawn the player in the some defualt start location
    pub impl ListenImpl of IListener<ContractState> {
        fn listen(ref self: ContractState, cmd: Array<ByteArray>, p_id: felt252) {
            //! we use this as an error flag to kick us into error
            //! catching routines later as we run the parses over
            //! the command string

            let mut world: WorldStorage = self.world(@"the_oruggin_trail");

            // world.write_model(@Output{playerId: 23, text_o_vision: "..."});

            let mut isErr: ErrCode = ErrCode::None;
            let l_cmd = @cmd;
            let l_cmd_cpy = l_cmd.clone();
            let mut wrld_dispatcher = world.dispatcher;

            if l_cmd.len() >= 16 {
                // we have bad food make an error and pass along to
                // the error outputter system
                isErr = ErrCode::BadLen;
                err_dispatcher::error_handle(ref wrld_dispatcher, p_id, isErr);
            } else {
                // grab the command stream array and extract a Garble type
                // for the game jam we want the fight command
                match confessor::confess(l_cmd_cpy) {
                    Result::Ok(r) => {
                        // we have a valid command so pass it into a handler routine
                        // this should really return err and a string
                        verb_dispatcher::handleGarble(ref wrld_dispatcher, p_id, r);
                    },
                    Result::Err(_r) => {
                        // this should really return err and a string
                        err_dispatcher::error_handle(ref wrld_dispatcher, p_id, isErr);
                    },
                }
            }
        }

        fn command_shoggoth(
            ref self: ContractState, victim: felt252, wish: Array<ByteArray>,
        ) -> ByteArray {
            // call into the main listen
            // the output is generated in the listen handler
            // which dispatches to the next handler etc
            // // in other words hit main game loop
            // println!("foolish desires: {:?}", wish);
            self.listen(wish, victim);

            // now read from the output model and exit
            let mut world = self.world(@"the_oruggin_trail");
            let cmd_output: Output = world.read_model(23);
            let shogoth_sees = cmd_output.text_o_vision;
            // println!("{:?}", shogoth_sees);
            shogoth_sees
        }
    }
}

pub mod pull_strings {
    use the_oruggin_trail::models::{
        output::{Output}, player::{Player} // zrk_enums::{ActionType, ObjectType},
    };

    use dojo::model::{ModelStorage};
    use dojo::world::{WorldStorage};

    use the_oruggin_trail::lib::look::lookat;

    pub fn enter_room(ref world: WorldStorage, ref player: Player, rm_id: felt252) {
        println!("PULL_STRINGS:------> enter_room");
        player.location = rm_id;
        world.write_model(@player);

        let out = lookat::describe_room_short(world, rm_id);
        world.write_model(@Output { playerId: player.player_id, text_o_vision: out });
    }
}

