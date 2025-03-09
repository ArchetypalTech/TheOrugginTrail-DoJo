//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

use the_oruggin_trail::models::{zrk_enums};
use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};
use the_oruggin_trail::models::{player::Player, room::Room, zrk_enums::{object_type_to_str}};
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
    pub objType: zrk_enums::ObjectType,
    pub dirType: zrk_enums::DirectionType,
    pub destId: felt252,
    pub matType: zrk_enums::MaterialType,
    pub objectActionIds: Array<felt252>,
    pub txtDefId: felt252,
    pub name: ByteArray,
    pub altNames: Array<ByteArray>,
}

pub fn doesObjectExist(object: Object) -> bool {
    object.clone().objectId != 0
}

pub fn getModelName(object: Object) -> ByteArray {
    let mut name: ByteArray = object.name;
    if name.len() == 0 {
        name = object_type_to_str(object.objType);
    }
    name
}

pub fn getModelReferences(object: Object) -> Array<ByteArray> {
    // we get the name, and all altNames
    let mut references: Array<ByteArray> = array![];
    let altNames = object.altNames.clone();
    references.append(getModelName(object));
    for altName in altNames {
        references.append(altName);
    };
    references
}
