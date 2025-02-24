
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

/// We put a set of room id's into the rooms
/// array and then use them to choose a spawn 
/// point for a user
#[derive(Clone, Drop, Serde)]
#[dojo::model]
pub struct Spawnroom {
    #[key]
    pub id: u32, // always 666
    pub rooms: Array<felt252>,
}