
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

//! Handle LOOK type actions
pub mod lookat {
    use the_oruggin_trail::constants::zrk_constants::{ErrCode as ec};
    use the_oruggin_trail::systems::tokeniser::{tokeniser as lexer, confessor, confessor::Garble};
    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use dojo::model::{ModelStorage};
    use the_oruggin_trail::models::{
        player::Player, room::Room,
        zrk_enums::{
            RoomType, room_type_to_str, BiomeType, biome_type_to_str, MaterialType,
            material_type_to_str, ObjectType, object_type_to_str, DirectionType,
            direction_type_to_str
        },
        txtdef::Txtdef, object::Object
    };

    /// look at stuff
    ///
    /// should take the garble and then decide to exmine a thing or look around.
    /// the general case is assumed to be for a room
    /// currently we just do the full description this should seperate into examination
    /// for objects etc.
        pub fn stuff(mut world: IWorldDispatcher, thing: Garble, pid: felt252) -> ByteArray {
        //get the player object
        // we are always player 23 right now
        let wrld: WorldStorage =  WorldStorageTrait::new(world, @"the_oruggin_trail");
        let player: Player = wrld.read_model(pid);
        let location: felt252 = player.location;
        let mut output: ByteArray = describe_room(wrld, location);
        output
    }

    // needs to add the state of the objects into consideration
    fn collate_objects(world: WorldStorage, location: felt252) -> ByteArray {
        let room: Room = world.read_model(location);
        let objects: Array<felt252> = room.objectIds.clone();
        let mut idx: u32 = 0;
        let mut out: ByteArray = "";
        let base: ByteArray = "you can see a";
        while idx < objects.len() {
            let _id: felt252 = objects.at(idx).clone();
            let obj: Object = world.read_model(_id);
            let _txt: Txtdef = world.read_model(obj.txtDefId.clone());
            let mut desc: ByteArray = format!(
                "{} {}, {}\n", base.clone(), object_type_to_str(obj.objType), _txt.text.clone(),
            );
            out.append(@desc);
            idx += 1;
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
                direction_type_to_str(exit.dirType)
            );
            out.append(@desc);
            idx += 1;
        };
        out
    }

    fn describe_object(world: WorldStorage, location: felt252) -> ByteArray {
        let mut output: ByteArray = "You see Elvis... \n, he speaks... \n apparantly garbage";
        output
    }

    /// describe the room, simple version
    ///
    /// ignores the objects in the place and generates
    /// a text descirption from the properties and shortTxt
    ///
    /// format as follows:
    ///
    /// "walking eagle pass" : name - shortTxt
    /// "You are standing on/in a pass in/on the prarie" : baseTxt + conn + roomType + conn +
    /// biomeType
    pub fn describe_room_short(world: WorldStorage, location: felt252) -> ByteArray {
        let room: Room = world.read_model(location);
        println!("ROOM:-----> {:?}, {:?}", location, room);
        let mut base_txt: ByteArray = "You are standing";
        let mut connective_txt_type: ByteArray = "";
        let mut connective_txt_biome: ByteArray = "";
        if room.roomType == RoomType::Plain || room.roomType == RoomType::Pass {
            connective_txt_type = "on a";
        } else {
            connective_txt_type = "in a";
        }

        if room.biomeType == BiomeType::Prarie || room.biomeType == BiomeType::Tundra {
            connective_txt_biome = "on the";
        } else {
            connective_txt_biome = "in the";
        }

        format!(
            "{}\n{} {} {} {} {}",
            room.shortTxt.clone(),
            base_txt.clone(),
            connective_txt_type,
            room_type_to_str(room.roomType),
            connective_txt_biome,
            biome_type_to_str(room.biomeType)
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
        if room.roomType == RoomType::None {
            let out: ByteArray =
                "there is nothing to look at, this world has not yet spawned.... shoggoth stares...";
            out
        } else {
            let txtModel: Txtdef = world.read_model(room.txtDefId);
            let txt: ByteArray = txtModel.text;
            let connective_txt: ByteArray = "the";
            let place_type: ByteArray = room_type_to_str(room.roomType);
            let exit_txt: ByteArray = collate_exits(world, location);
            let obj_txt: ByteArray = collate_objects(world, location);
            format!("{} {} {}\n{}\n{}", connective_txt.clone(), place_type, txt, exit_txt, obj_txt)
        }
    }
}
