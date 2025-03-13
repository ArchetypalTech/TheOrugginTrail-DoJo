//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

use the_oruggin_trail::models::{zrk_enums};

#[derive(Clone, Drop, Serde)]
#[dojo::model]
pub struct Action {
    #[key]
    pub actionId: felt252,
    pub actionType: zrk_enums::ActionType,
    pub dBitTxt: ByteArray, // when the bit is set then output this
    pub enabled: bool,
    pub revertable: bool,
    pub dBit: bool,
    pub affectsActionId: felt252,
    pub affectedByActionId: felt252,
}
