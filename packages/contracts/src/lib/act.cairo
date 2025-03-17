//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod pullstrings {
    use dojo::model::ModelStorage;
    use the_oruggin_trail::systems::tokeniser::{lexer::Garble};
    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use the_oruggin_trail::models::{
        player::Player, object::Object, action::Action, inventory::Inventory,
    };

    pub fn on(world: IWorldDispatcher, pid: felt252, msg: Garble) -> ByteArray {
        let mut wrld: WorldStorage = WorldStorageTrait::new(world, @"the_oruggin_trail");

        let pl: Player = wrld.read_model(pid);
        // just run through the inventory stuff we will handle room defaults later
        let inv_id = pl.inventory;
        let inv: Inventory = wrld.read_model(inv_id);
        let inv_items: Array<felt252> = inv.items.clone();
        let inv_out: ByteArray = handle_default(wrld, inv_items.span(), msg);
        inv_out
    }

    /// handle default actions
    ///
    /// we store an action on an object and if there is no indirect object
    /// then we use that as there is no object chain to use
    ///
    /// this gets called on INVENTORY objects first
    /// then on room objects BUT probably the only specials that need a ROOM to make sense
    /// are things like OPEN ? not sure really
    /// for now we just are crude and we don't bother checking in the room
    /// maybe we should specialise on opens ?
    fn handle_default(mut world: WorldStorage, objs: Span<felt252>, msg: Garble) -> ByteArray {
        println!("default {:?}", objs.len());
        let mut out: ByteArray = "quite literally nothing happens. pfft";
        let mut idx: u32 = 0;
        let mut inr: u32 = 0;
        // let responds_to = lexer::vrb_to_response(vrb);
        while idx < objs.len() {
            let obj_id = objs.at(idx).clone();
            let obj: Object = world.read_model(obj_id);
            // check the type against the dObj
            if obj.objType == msg.dobj {
                let action_ids = obj.objectActionIds.clone();
                while inr < action_ids.len() {
                    let action_id = action_ids.at(inr);
                    let mut action: Action = world.read_model(*action_id);
                    // check the state bits
                    // for now just check enabled
                    if action.enabled {
                        action.dBit = !action.dBit;
                        out = action.dBitTxt
                    }
                    inr += 1;
                }
            }
            idx += 1;
        };
        out
    }
}
