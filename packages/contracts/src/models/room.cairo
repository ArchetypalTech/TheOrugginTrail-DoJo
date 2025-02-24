
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

use the_oruggin_trail::models::{zrk_enums as zrk};

/// Room model
/// 
/// When we store a room to the store
/// we can optionally add it's id to the Spawnroom 
/// set of rooms, then when a player joins we can
/// use this to dump them into the world screaming
/// 
/// sadly we dont right now
#[derive(Clone, Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Room{
    #[key]
    pub roomId: felt252, // this should not be a hash and just increment in spawning/adding
    pub roomType: zrk::RoomType,
    pub biomeType: zrk::BiomeType,
    pub txtDefId: felt252,
    pub shortTxt: ByteArray,
    pub objectIds: Array<felt252>,
    pub dirObjIds: Array<felt252>,
    pub players: Array<felt252>
}

// fn room_mock_hash() -> felt252 {
//     //! if the room is setup differently in the setup code then the test hash
//     //! will need to reflect the new hash that will be output in test
//     679126177692160935767718057937299270179710925153250945316841215033062892639
// }

