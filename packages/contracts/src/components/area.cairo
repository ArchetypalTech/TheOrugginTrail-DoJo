#[derive(Clone, Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Room {
    #[key]
    pub inst: felt252,
    pub is_area: bool,
    //properties
    pub name: ByteArray,
    pub roomType: zrk_enums::RoomType,
    pub biomeType: zrk_enums::BiomeType,
    pub txtDefId: felt252,
    pub shortTxt: ByteArray,
    pub object_ids: Array<felt252>,
    pub players: Array<felt252>,
}

pub fn doesRoomExist(room: Room) -> bool {
    room.clone().roomId != 0
}
