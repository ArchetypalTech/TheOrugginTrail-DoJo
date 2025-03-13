//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod lookat {
    use the_oruggin_trail::systems::tokeniser::{confessor::Garble};
    use dojo::world::{WorldStorage};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::lib::world;
    use the_oruggin_trail::models::{
        player::Player, room::Room,
        zrk_enums::{material_type_to_str, object_type_to_str, direction_type_to_str, ActionType},
        txtdef::Txtdef, object::Object, object,
    };

    /// look at stuff
    ///
    /// should take the garble and then decide to exmine a thing or look around.
    /// the general case is assumed to be for a room
    /// currently we just do the full description this should seperate into examination
    /// for objects etc.
    pub fn action_look(world: WorldStorage, message: Garble, player: Player) -> ByteArray {
        let location: felt252 = player.location;
        if (message.matchedObject != 0) {
            let object: Object = world::getObjectById(world, message.matchedObject);
            let output: ByteArray = describe_object(world, object);
            return output;
        }
        let output: ByteArray = describe_room(world, location);
        output
    }

    fn describe_object(world: WorldStorage, object: Object) -> ByteArray {
        let look_action = world::getObjectActionOfType(world, object.objectId, ActionType::Look);
        if look_action.enabled {
            let output: ByteArray = look_action.dBitTxt;
            return output;
        }
        let output: ByteArray = world::getTextById(world, object.txtDefId);
        output
    }

    /// describe the room, simple version
    ///
    /// just shows the place title and the items
    pub fn describe_room_short(world: WorldStorage, location: felt252) -> ByteArray {
        let room: Room = world.read_model(location);
        println!("ROOM:-----> {:?}, {:?}", location, room);
        // let mut base_txt: ByteArray = "You are standing";
        // let mut connective_txt_type: ByteArray = "";
        // let mut connective_txt_biome: ByteArray = "";
        // if room.roomType == RoomType::Plain || room.roomType == RoomType::Pass {
        //     connective_txt_type = "on a";
        // } else {
        //     connective_txt_type = "in a";
        // }

        // if room.biomeType == BiomeType::Prarie || room.biomeType == BiomeType::Tundra {
        //     connective_txt_biome = "on the";
        // } else {
        //     connective_txt_biome = "in the";
        // }

        format!("{}", // "{}\n{} {} {} {} {}",
        room.shortTxt.clone() // base_txt.clone(),
        // connective_txt_type,
        // room_type_to_str(room.roomType),
        // connective_txt_biome,
        // biome_type_to_str(room.biomeType),
        )
    }

    /// describe the room, bigger version
    ///
    /// loops through the objects in the place and generates
    /// a text descirption from the properties of the objects
    ///
    /// format as follows:
    /// "the valley sides ...": txtDefId
    /// "you can see a path to the west ..." : exits - dirObjects
    /// "there is a manky otter pelt on the floor": objects
    fn describe_room(world: WorldStorage, location: felt252) -> ByteArray {
        let room: Room = world.read_model(location);

        if room.roomId == 0 {
            return format!("[ERROR INVALID ROOM]: {}:", location);
        }
        let txtModel: Txtdef = world.read_model(room.txtDefId);
        let txt: ByteArray = txtModel.text;
        // let connective_txt: ByteArray = "the";
        // let place_type: ByteArray = room_type_to_str(room.roomType);
        // let exit_txt: ByteArray = collate_exits(world, location);
        let obj_txt: ByteArray = collate_objects(world, location);
        // return format!("{}\n{}\n{}", txt, exit_txt, obj_txt);
        return format!("{}\n{}", txt, obj_txt);
        // }
    }

    // needs to add the state of the objects into consideration
    fn collate_objects(world: WorldStorage, location: felt252) -> ByteArray {
        let room: Room = world.read_model(location);
        let objects = world::getRoomObjects(world, room);
        let mut out: ByteArray = "";
        let base: ByteArray = "You can see a";
        for object in objects {
            let text = world::getTextById(world, object.txtDefId);
            let objName = object::getObjectName(object);
            let desc: ByteArray = format!("{} {}, {}\n", base.clone(), objName, text.clone());
            out.append(@desc);
        };
        out
    }

    fn collate_exits(world: WorldStorage, location: felt252) -> ByteArray {
        let room: Room = world.read_model(location);
        let mut exits: Array<felt252> = room.dirObjIds.clone();
        let mut idx: u32 = 0;
        let mut out: ByteArray = "";
        let base: ByteArray = "there is a";
        let dir_connective: ByteArray = "to the";
        while idx < exits.len() {
            let rm_id: felt252 = exits.at(idx).clone();
            let exit: Object = world.read_model(rm_id);
            let mut desc: ByteArray = format!(
                "{} {} {} {} {}\n",
                base.clone(),
                material_type_to_str(exit.matType),
                object_type_to_str(exit.objType),
                dir_connective.clone(),
                direction_type_to_str(exit.dirType),
            );
            out.append(@desc);
            idx += 1;
        };
        out
    }
}
