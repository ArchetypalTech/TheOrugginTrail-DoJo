use the_oruggin_trail::models::{action::{Action}, object::{Object}, room::{Room}};

#[starknet::interface]
pub trait IDesigner<TContractState> {
    fn create_objects(ref self: TContractState, t: Array<Object>);
    fn create_actions(ref self: TContractState, t: Array<Action>);
    fn create_rooms(ref self: TContractState, t: Array<Room>);
    fn create_txt(ref self: TContractState, id: felt252, ownedBy: felt252, val: ByteArray);
    fn delete_objects(ref self: TContractState, ids: Array<felt252>);
    fn delete_actions(ref self: TContractState, ids: Array<felt252>);
    fn delete_rooms(ref self: TContractState, ids: Array<felt252>);
    fn delete_txts(ref self: TContractState, ids: Array<felt252>);
}

#[dojo::contract]
pub mod designer {
    use super::IDesigner;

    use the_oruggin_trail::models::{
        txtdef::{Txtdef}, action::{Action}, object::{Object}, room::{Room},
    };
    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use dojo::model::{ModelStorage};

    #[abi(embed_v0)]
    pub impl DesignerImpl of IDesigner<ContractState> {
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

        fn delete_objects(ref self: ContractState, ids: Array<felt252>) {
            let mut world = self.world(@"the_oruggin_trail");

            let mut objectsArray = array![];
            for id in ids {
                let model: Object = world.read_model(@id);
                objectsArray.append(model);
            };

            let span: Span<@Object> = objectsArray.span();
            world.erase_models(span);
        }

        fn delete_actions(ref self: ContractState, ids: Array<felt252>) {
            let mut world = self.world(@"the_oruggin_trail");

            let mut actionsArray = array![];
            for id in ids {
                let model: Action = world.read_model(@id);
                actionsArray.append(model);
            };

            let span: Span<@Action> = actionsArray.span();
            world.erase_models(span);
        }

        fn delete_rooms(ref self: ContractState, ids: Array<felt252>) {
            let mut world = self.world(@"the_oruggin_trail");

            let mut roomsArray = array![];
            for id in ids {
                let model: Room = world.read_model(@id);
                roomsArray.append(model);
            };

            let span: Span<@Room> = roomsArray.span();
            world.erase_models(span);
        }

        fn delete_txts(ref self: ContractState, ids: Array<felt252>) {
            let mut world = self.world(@"the_oruggin_trail");

            let mut txtsArray = array![];
            for id in ids {
                let model: Txtdef = world.read_model(@id);
                txtsArray.append(model);
            };

            let span: Span<@Txtdef> = txtsArray.span();
            world.erase_models(span);
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
