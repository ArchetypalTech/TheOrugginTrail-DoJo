use the_oruggin_trail::models::{
    zrk_enums as zrk, txtdef::{Txtdef}, action::{Action}, object::{Object}, room::{Room},
    player::{Player}, inventory::{Inventory},
};

#[starknet::interface]
pub trait IDesigner<TContractState> {
    fn create_object(ref self: TContractState, t: Object);
    fn create_objects(ref self: TContractState, t: Array<Object>);
    fn create_actions(ref self: TContractState, t: Array<Action>);
    fn create_rooms(ref self: TContractState, t: Array<Room>);
    fn create_txt(ref self: TContractState, id: felt252, ownedBy: felt252, val: ByteArray);
}

#[dojo::contract]
pub mod designer {
    use starknet::{ContractAddress, testing, get_caller_address};
    use core::byte_array::ByteArrayTrait;
    use core::array::ArrayTrait;
    use core::option::OptionTrait;
    use super::IDesigner;

    use the_oruggin_trail::models::{
        zrk_enums as zrk, txtdef::{Txtdef}, action::{Action}, object::{Object}, room::{Room},
        player::{Player}, inventory::{Inventory},
    };

    use the_oruggin_trail::constants::zrk_constants as zc;
    use the_oruggin_trail::constants::zrk_constants::{roomid as rm, statusid as st};
    use the_oruggin_trail::lib::hash_utils::hashutils as h_util;
    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use dojo::model::{ModelStorage};

    #[abi(embed_v0)]
    pub impl DesignerImpl of IDesigner<ContractState> {
        fn create_object(ref self: ContractState, t: Object) {
            let mut world = self.world(@"the_oruggin_trail");
            let mut a = ArrayTrait::new();
            a.append(t);
            store_objects(world.dispatcher, a);
        }

        fn create_objects(ref self: ContractState, t: Array<Object>) {
            let mut world = self.world(@"the_oruggin_trail");
            store_objects(world.dispatcher, t);
        }

        fn create_actions(ref self: ContractState, t: Array<Action>) {
            let mut world = self.world(@"the_oruggin_trail");
            store_actions(world.dispatcher, t);
        }

        fn create_rooms(ref self: ContractState, t: Array<Room>) {
            let mut world = self.world(@"the_oruggin_trail");
            store_places(world.dispatcher, t);
        }

        fn create_txt(ref self: ContractState, id: felt252, ownedBy: felt252, val: ByteArray) {
            let mut world = self.world(@"the_oruggin_trail");
            store_txt(world.dispatcher, id, ownedBy, val);
        }
    }

    fn store_objects(w: IWorldDispatcher, t: Array<Object>) {
        let mut world: WorldStorage = WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_actions(w: IWorldDispatcher, t: Array<Action>) {
        let mut world: WorldStorage = WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_places(w: IWorldDispatcher, t: Array<Room>) {
        let mut world: WorldStorage = WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_txt(world: IWorldDispatcher, id: felt252, ownedBy: felt252, val: ByteArray) {
        let mut world: WorldStorage = WorldStorageTrait::new(world, @"the_oruggin_trail");
        world.write_model(@Txtdef { id: id, owner: ownedBy, text: val });
    }
}
