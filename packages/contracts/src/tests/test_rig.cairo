
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

#[cfg(test)]
pub mod test_rig {
    use dojo_cairo_test::WorldStorageTestTrait;
use starknet::{ContractAddress, testing, get_caller_address};
    use core::traits::Into;

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait, WorldStorageTrait, WorldStorage};
    use dojo::model::{ModelStorage, ModelValueStorage, ModelStorageTest};
    use dojo_cairo_test::{spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef};

    use the_oruggin_trail::models::{
        output::{Output, m_Output},
        action::{Action, m_Action},
        room::{Room, m_Room},
        object::{Object, m_Object},
        player::{Player, m_Player},
        txtdef::{Txtdef, m_Txtdef},
        inventory::{Inventory, m_Inventory},
    };

    use the_oruggin_trail::systems::meatpuppet::{ 
        meatpuppet,
        IListenerDispatcher, 
    };

    use the_oruggin_trail::systems::spawner::{ 
        spawner,
        ISpawnerDispatcher, 
    };

    use the_oruggin_trail::lib::store::{Store, StoreTrait}; 

    pub fn ZERO() -> ContractAddress { starknet::contract_address_const::<0x0>() }
    pub fn OWNER() -> ContractAddress { starknet::contract_address_const::<0x1>() }
    pub fn OTHER() -> ContractAddress { starknet::contract_address_const::<0x2>() }


    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "the_oruggin_trail", resources: [
                TestResource::Model(m_Output::TEST_CLASS_HASH),
                TestResource::Model(m_Action::TEST_CLASS_HASH),
                TestResource::Model(m_Room::TEST_CLASS_HASH),
                TestResource::Model(m_Object::TEST_CLASS_HASH),
                TestResource::Model(m_Player::TEST_CLASS_HASH),
                TestResource::Model(m_Txtdef::TEST_CLASS_HASH),
                TestResource::Model(m_Inventory::TEST_CLASS_HASH),
                TestResource::Contract(spawner::TEST_CLASS_HASH),
                TestResource::Contract(meatpuppet::TEST_CLASS_HASH)
            ].span()
        };
        ndef
    }
    
    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"the_oruggin_trail", @"spawner")
                .with_writer_of([dojo::utils::bytearray_hash(@"the_oruggin_trail")].span()),
            ContractDefTrait::new(@"the_oruggin_trail", @"meatpuppet")
                .with_writer_of([dojo::utils::bytearray_hash(@"the_oruggin_trail")].span())
        ].span()
    }

    // set_contract_address : to define the address of the calling contract,
    // set_account_contract_address : to define the address of the account used for the current transaction.
    fn impersonate(address: ContractAddress) {
        testing::set_contract_address(address);
        testing::set_account_contract_address(address);
    }

    #[derive(Copy, Drop)]
    pub struct Systems {
        pub world: WorldStorage,
        pub listener: IListenerDispatcher,
        pub spawner: ISpawnerDispatcher
    }

    #[inline(always)]
    pub fn deploy_system(world: WorldStorage, contract: @ByteArray) -> ContractAddress {
         match world.dns(contract) {
            Option::Some((contract_address, _)) => {
                (contract_address)
            },
            Option::None => {
                (ZERO())
            }
        }
    }

    pub fn setup_world() -> Systems {
        // deploy world, models, systems etc
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());


        // deploy systems and set OWNER on the systems we want so we can write through
        let tot_listen = IListenerDispatcher{ contract_address:
            {
                deploy_system(world, @"meatpuppet")
            }
        };

        let tot_spawner = ISpawnerDispatcher{ contract_address:
            {
                deploy_system(world, @"spawner")
            }
        };
        

        // let store: Store = StoreTrait::new(world);

        (Systems{
            world,
            listener:tot_listen,
            spawner:tot_spawner,
        })
    }

}