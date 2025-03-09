//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod err_dispatcher {
    use the_oruggin_trail::constants::zrk_constants::ErrCode;
    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::models::{output::{Output}};

    pub fn error_handle(ref world: IWorldDispatcher, pid: felt252, err: ErrCode) {
        let bogus_cmd: Array<ByteArray> = array![];
        let speech = opine_on_errors(err, @bogus_cmd);
        let mut world: WorldStorage = WorldStorageTrait::new(world, @"the_oruggin_trail");
        world.write_model(@Output { playerId: pid, text_o_vision: speech });
    }

    pub fn opine_on_errors(err: ErrCode, cmd: @Array<ByteArray>) -> ByteArray {
        match err {
            ErrCode::BadLen => {
                "Whoa, slow down pilgrim. Enunciate... less noise... more signal"
            },
            ErrCode::BadFood => { "Nope ..., errm .... just no, it makes no sense at all" },
            _ => { "I don't know what that means" },
        }
    }
}
