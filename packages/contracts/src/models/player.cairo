
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

use starknet::ContractAddress;

/// Player model
/// 
/// the player id should really be a felt252
#[derive(Copy, Drop, Serde, Debug, Introspect)]
#[dojo::model]
pub struct Player {
    #[key]
    pub player_id: felt252,
    pub player_adr: ContractAddress,
    pub location: felt252,
    pub inventory: felt252
}

