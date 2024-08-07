use the_oruggin_trail::models::{zrk_enums as zrk};

/// When we store a room to the store
/// we can optionally add it's id to the Spawnroom 
/// set of rooms, then when a player joins we can
/// use this to dump them into the world screaming
#[derive(Clone, Drop, Serde)]
#[dojo::model]
struct Room{
    #[key]
    roomId: felt252,
    roomType: zrk::RoomType,
    txtDefId: felt252,
    shortTxt: ByteArray,
    objectIds: Array<felt252>,
    dirObjIds: Array<felt252>,
    players: Array<felt252>
}

// fn room_mock_hash() -> felt252 {
//     //! if the room is setup differently in the setup code then the test hash
//     //! will need to reflect the new hash that will be output in test
//     679126177692160935767718057937299270179710925153250945316841215033062892639
// }

