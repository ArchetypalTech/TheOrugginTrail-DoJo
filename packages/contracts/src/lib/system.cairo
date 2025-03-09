//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

use starknet::{ContractAddress};
use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};

use the_oruggin_trail::utils::misc::{ZERO};
use the_oruggin_trail::systems::designer::{IDesignerDispatcher};

use the_oruggin_trail::constants::zrk_constants::{ZrkSystemStringsImpl};

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
    fn designer_dispatcher(self: IWorldDispatcher) -> IDesignerDispatcher {
        (IDesignerDispatcher { contract_address: self.contract_address(@"designer") })
    }

    #[inline(always)]
    fn storage(self: IWorldDispatcher, namespace: @ByteArray) -> WorldStorage {
        (WorldStorageTrait::new(self, namespace))
    }
}
