
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

use the_oruggin_trail::models::zrk_enums as zrk;

#[derive(Drop, Serde, Clone)]
#[dojo::model]
pub struct Txtdef {
    #[key]
    pub id: felt252,
    pub owner: felt252,
    pub text: ByteArray 
}