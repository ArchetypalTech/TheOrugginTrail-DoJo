//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*
use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};
use the_oruggin_trail::models::{zrk_enums, object::Object, object};

#[derive(Clone, Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Room {
    #[key]
    pub roomId: felt252,
    pub roomType: zrk_enums::RoomType,
    pub biomeType: zrk_enums::BiomeType,
    pub txtDefId: felt252,
    pub shortTxt: ByteArray,
    pub objectIds: Array<felt252>,
    pub dirObjIds: Array<felt252>,
    pub players: Array<felt252>,
}

pub fn doesRoomExist(room: Room) -> bool {
    room.clone().roomId != 0
}
