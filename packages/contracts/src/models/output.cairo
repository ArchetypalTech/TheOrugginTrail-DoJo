
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

#[derive(Drop, Serde)]
#[dojo::model]
pub struct Output {
    #[key]
    pub playerId: felt252,
    pub text_o_vision: ByteArray,
}
