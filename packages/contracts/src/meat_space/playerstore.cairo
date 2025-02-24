
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

use the_oruggin_trail::models::{zrk_enums as zrk};

#[derive(Clone, Drop, Serde)]
#[dojo::model]
struct PlayerStore {
    #[key]
    playerId: felt252,
    roomId: felt252,
    objectIds: Array<felt252> 
}
