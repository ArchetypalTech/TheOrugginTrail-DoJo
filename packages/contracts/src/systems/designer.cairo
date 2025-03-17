use the_oruggin_trail::models::{txtdef::{Txtdef}, action::{Action}, object::{Object}, room::{Room}};

#[starknet::interface]
pub trait IDesigner<TContractState> {
    fn create_objects(ref self: TContractState, t: Array<Object>);
    fn create_actions(ref self: TContractState, t: Array<Action>);
    fn create_rooms(ref self: TContractState, t: Array<Room>);
    fn create_txts(ref self: TContractState, t: Array<Txtdef>);
}

#[dojo::contract]
pub mod designer {
    use super::IDesigner;

    use the_oruggin_trail::models::{
        txtdef::{Txtdef}, action::{Action}, object::{Object}, room::{Room},
    };
    use dojo::model::{ModelStorage};

    #[abi(embed_v0)]
    pub impl DesignerImpl of IDesigner<ContractState> {
        fn create_objects(ref self: ContractState, t: Array<Object>) {
            let mut world = self.world(@"the_oruggin_trail");
            for o in t {
                world.write_model(@o);
            }
        }

        fn create_actions(ref self: ContractState, t: Array<Action>) {
            let mut world = self.world(@"the_oruggin_trail");
            for o in t {
                world.write_model(@o);
            }
        }

        fn create_rooms(ref self: ContractState, t: Array<Room>) {
            let mut world = self.world(@"the_oruggin_trail");
            for o in t {
                world.write_model(@o);
            }
        }

        fn create_txts(ref self: ContractState, t: Array<Txtdef>) {
            let mut world = self.world(@"the_oruggin_trail");
            for o in t {
                world.write_model(@o);
            }
        }
    }
}
