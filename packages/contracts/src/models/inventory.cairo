
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

/// player inventory
/// 
#[derive(Clone, Drop, Serde)]
#[dojo::model]
pub struct Inventory {
    #[key]
    pub owner_id : felt252,
    pub items : Array<felt252>
}

