//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

 /// @title The Oruggin Trail
 /// @author lbdl | itrainspiders
 /// @notice The outputter is responsible for the final "view" into the room that the 
 /// player will conceptually "see" or rather read. 
#[starknet::interface]
trait IOutputter<T> {
    fn spawn(ref self: T);
    fn updateOutput(ref self: T, txt: ByteArray);
}

#[dojo::contract]
mod outputter {
    use super::{IOutputter};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::models::output::{Output} ;

    #[abi(embed_v0)]
    impl OutputterImpl of IOutputter<ContractState> {
        fn spawn(ref self: ContractState) {

        }

        fn updateOutput(ref self: ContractState, txt: ByteArray) {
            //! note the hardcoded 23 as the playerId we are just keeping
            //! for the now but it should go away and be replaced with a 
            //! "real" identifier. Not sure what that looks like right now 
            
            // let out = Output{playerId: 23, text_o_vision: txt};
            // out.set!(world);
            let mut world = self.world(@"the_oruggin_trail");
            world.write_model(@Output{playerId: 23, text_o_vision: txt});
        }
    }
}