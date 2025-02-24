
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod hashutils {
    use core::array::ArrayTrait;
    use core::traits::Into;
    use core::clone::Clone;
    use core::poseidon::PoseidonTrait;
    use core::poseidon::poseidon_hash_span;
    use core::hash::{HashStateTrait, HashStateExTrait};

    use the_oruggin_trail::models::{
        room::{Room}, object::{Object}, action::{Action},
        zrk_enums::{
            MaterialType, ObjectType, ActionType, TxtDefType, DirectionType, RoomType, BiomeType
        }
    };

    use the_oruggin_trail::constants::zrk_constants::{flags};


    /// ObjectType hashing
    /// 
    /// Should/can it be a trait? Probably
    /// We hash all the values othert than objectId as this
    /// is returned and we then store the object with this
    /// i.e. h => h(obj.*; if obj.* != id) 
   pub fn obj_hash(obj: @Object) -> felt252 {
        let local: Object = obj.clone();
        let mut hash = PoseidonTrait::new()
            .update(local.objType.into())
            .update(local.dirType.into())
            .update(local.matType.into())
            .update(local.destId)
            .update(local.txtDefId)
            .update(poseidon_hash_span(local.objectActionIds.span()))
            .finalize();
        if flags::DEBUG {
            println!("obj: {:?}", hash);
        }
        hash
    }

    pub fn place_hash(plc: @Room) -> felt252 {
        let local: Room = plc.clone();
        let shrt: Array<felt252> = ba_to_felt(@local.shortTxt);
        let mut hash = PoseidonTrait::new()
            .update(poseidon_hash_span(shrt.span()))
            .finalize();

        if flags::DEBUG {
            println!("room: {:?}", hash);
        }
        hash
    }

    pub fn action_hash(vrb: @Action) -> felt252 {
        let local: Action = vrb.clone();
        let dbittxt: Array<felt252> = ba_to_felt(@local.dBitTxt);
        let mut hash = PoseidonTrait::new()
            .update(local.actionType.into())
            .update(poseidon_hash_span(dbittxt.span()))
            .update(local.enabled.into())
            .update(local.revertable.into())
            .update(local.dBit.into())
            .update(local.affectsActionId)
            .update(local.affectedByActionId)
            .finalize();
        if flags::DEBUG {
            println!("vrb: {:?}, {:?}", local.actionType, hash);
        }
        hash
    }

    pub fn ba_to_felt(in: @ByteArray) -> Array<felt252> {
        let local = in.clone();
        let l = local.len();
        let mut idx = 0;
        let mut arr_felt: Array<felt252> = ArrayTrait::new();

        while idx < l {
            let f: felt252 = local.at(idx).unwrap().into();
            arr_felt.append(f);
            idx += 1;
        };
        arr_felt
    }

    pub fn str_hash(txt: @ByteArray) -> felt252 {
        let local = txt.clone();
        let mut arr_felt: Array<felt252> = ba_to_felt(@local);
        let hash = PoseidonTrait::new().update(poseidon_hash_span(arr_felt.span())).finalize();
        hash
    }
}
