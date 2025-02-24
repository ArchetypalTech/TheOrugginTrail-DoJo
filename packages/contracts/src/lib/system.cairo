
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

use starknet::{ContractAddress, ClassHash};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait, Resource, WorldStorage, WorldStorageTrait};

use the_oruggin_trail::utils::misc::{ZERO};
use the_oruggin_trail::systems::spawner::{ISpawnerDispatcher, ISpawnerDispatcherTrait};

use the_oruggin_trail::constants::zrk_constants::{ZrkSystemStrings, ZrkSystemStringsImpl};

#[generate_trait]
pub impl WorldSystemsTraitImpl of WorldSystemsTrait {

    fn contract_address(self: IWorldDispatcher, selector: @ByteArray) -> ContractAddress {
        let ns: ByteArray = ZrkSystemStringsImpl::ns();
        let world: WorldStorage = WorldStorageTrait::new(self, @ns);
        if let Option::Some((address, _)) = world.dns(selector) {
            println!("HNDL:SYS----> {:?}", address);
            (address)
        } else {
            println!("HNDL:SYS----> ZERO");
            (ZERO())
        }
    }

    #[inline(always)]
    fn spawner_dispatcher(self: IWorldDispatcher) -> ISpawnerDispatcher {
        (ISpawnerDispatcher{ contract_address: self.contract_address(@"spawner") })
    }

    #[inline(always)]
    fn storage(self: IWorldDispatcher, namespace: @ByteArray) -> WorldStorage {
        (WorldStorageTrait::new(self, namespace))
    }
}
