
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod err_dispatcher {
    use the_oruggin_trail::constants::zrk_constants::ErrCode as ec;
    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::lib::insult_meat::insulter as badmouth;
    use the_oruggin_trail::models::{output::{Output}};

    pub fn error_handle(ref world: IWorldDispatcher, pid: felt252, err: ec) {
        let bogus_cmd: Array<ByteArray> = array![];
        let speech = badmouth::opine_on_errors(err, @bogus_cmd);
        let mut world: WorldStorage =  WorldStorageTrait::new(world, @"the_oruggin_trail");
        world.write_model(@Output{playerId: pid, text_o_vision: speech});
    }
}