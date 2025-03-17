use the_oruggin_trail::models::{zrk_enums};

#[derive(Clone, Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Area {
    #[key]
    pub inst: felt252,
    pub is_area: bool,
    //properties
    pub name: ByteArray,
    pub txtDefId: felt252,
    pub object_ids: Array<felt252>,
}

pub fn doesRoomExist(room: Area) -> bool {
    room.is_area
}
