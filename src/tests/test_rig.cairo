#[cfg(test)]
pub mod test_rig {
    use starknet::{ContractAddress, testing, get_caller_address};
    use core::traits::Into;

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::utils::test::{spawn_test_world, deploy_contract};

    use the_oruggin_trail::models::{
        output::{output, Output},
        action::{action, Action},
        room::{room, Room},
        object::{object, Object},
        player::{player, Player},
        txtdef::{txtdef, Txtdef}
    };

    use the_oruggin_trail::systems::meatpuppet::{ 
        meatpuppet, 
        IListenerDispatcher, 
        IListenerDispatcherTrait 
    };

    use the_oruggin_trail::systems::spawner::{ 
        spawner, 
        ISpawnerDispatcher, 
        ISpawnerDispatcherTrait 
    };
    
    use the_oruggin_trail::lib::store::{Store, StoreTrait}; 

    pub fn ZERO() -> ContractAddress { starknet::contract_address_const::<0x0>() }
    pub fn OWNER() -> ContractAddress { starknet::contract_address_const::<0x1>() }
    pub fn OTHER() -> ContractAddress { starknet::contract_address_const::<0x2>() }
 
    // set_contract_address : to define the address of the calling contract,
    // set_account_contract_address : to define the address of the account used for the current transaction.
    fn impersonate(address: ContractAddress) {
        testing::set_contract_address(address);
        testing::set_account_contract_address(address);
    }

    #[derive(Copy, Drop)]
    pub struct Systems {
        pub world: IWorldDispatcher,
        pub listener: IListenerDispatcher,
        pub spawner: ISpawnerDispatcher,
        pub store: Store,
    }

    #[inline(always)]
    pub fn deploy_system(world: IWorldDispatcher, salt: felt252, class_hash: felt252) -> ContractAddress {
        let contract_address = world.deploy_contract(salt, class_hash.try_into().unwrap());
        (contract_address)
    }

    pub fn setup_world() -> Systems {

        let mut models = array![
            output::TEST_CLASS_HASH,
            action::TEST_CLASS_HASH,
            room::TEST_CLASS_HASH,
            object::TEST_CLASS_HASH,
            player::TEST_CLASS_HASH,
            txtdef::TEST_CLASS_HASH,
        ];

        // deploy world, models, systems etc
        let namespace: ByteArray = "the_oruggin_trail";
        let ns: ByteArray = namespace.clone();
        let namespaces = [namespace];
        let world: IWorldDispatcher = spawn_test_world(namespaces.span(),  models.span());

        // allow us OWNER over stuff 
        world.grant_owner(dojo::utils::bytearray_hash(@ns), OWNER());
        // world.contract_address.print();

        // deploy systems and set OWNER on the systems we want so we can write through
        let tot_listen = IListenerDispatcher{ contract_address:
            {
                let address = deploy_system(world, 'meatpuppet', meatpuppet::TEST_CLASS_HASH);
                world.grant_owner(dojo::utils::bytearray_hash(@ns), address);
                (address)
            }
        };

        let tot_spawner = ISpawnerDispatcher{ contract_address:
            {
                let address = deploy_system(world, 'spawner', spawner::TEST_CLASS_HASH);
                world.grant_owner(dojo::utils::bytearray_hash(@ns), address);
                (address)
            }
        };
        
        impersonate(OWNER());

        let store: Store = StoreTrait::new(world);

        (Systems{
            world,
            listener:tot_listen,
            spawner:tot_spawner,
            store,
        })
    }

}