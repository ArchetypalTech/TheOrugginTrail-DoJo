//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

use the_oruggin_trail::models::{zrk_enums};

#[derive(Clone, Drop, Serde)]
#[dojo::model]
pub struct Object {
    #[key]
    pub inst: felt252,
    pub is_object: bool,
    pub objType: zrk_enums::ObjectType,
    pub dirType: zrk_enums::DirectionType,
    pub destId: felt252,
    pub matType: zrk_enums::MaterialType,
    pub objectActionIds: Array<felt252>,
    pub txtDefId: felt252,
    pub name: ByteArray,
    pub altNames: Array<ByteArray>,
}

#[generate_trait]
pub impl ObjectImpl of ObjectTrait {
    fn is_object(self: Object) -> bool {
        self.is_object
    }

    fn get_object_name(self: Object) -> ByteArray {
        self.name
    }

    fn get_object_alt_refs(self: Object) -> Array<ByteArray> {
        let mut references: Array<ByteArray> = array![];
        let altNames = self.altNames.clone();
        references.append(self.get_object_name().clone());
        for altName in altNames {
            references.append(altName.clone());
        };
        references
    }
}
