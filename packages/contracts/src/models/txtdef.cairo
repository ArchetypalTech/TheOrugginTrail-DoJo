//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

#[derive(Drop, Serde, Clone)]
#[dojo::model]
pub struct Txtdef {
    #[key]
    pub id: felt252,
    pub owner: felt252,
    pub text: ByteArray,
}
