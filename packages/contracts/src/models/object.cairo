
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

use the_oruggin_trail::models::{zrk_enums as zrk};

/// Objects are both Objects/things and now Direction things
/// like doors etc
/// 
/// we should think about using this as the reverse door as well
/// maybe a flag in the setup functions that add the reverse mapping?
#[derive(Clone, Drop, Serde)]
#[dojo::model]
pub struct Object {
    #[key]
    pub objectId: felt252,
    pub objType: zrk::ObjectType,
    pub dirType: zrk::DirectionType,
    pub destId: felt252,
    pub matType: zrk::MaterialType,
    pub objectActionIds: Array<felt252>,
    pub txtDefId: felt252
}

/// Returns the p has of the contents of the 
/// p_west Object in the Spawner::pass_gen function
/// just used for tests
pub fn obj_mock_hash() -> felt252 {
    2890677428083589291721203693367688373625972625165016977404295659692755897800
}

pub fn ball_mock_hash() -> felt252 {
    3275117108522619323919331625316279403006627873340444863280843568543699142320
}

