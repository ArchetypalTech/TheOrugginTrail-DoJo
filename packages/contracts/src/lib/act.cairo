
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod pullstrings {
    use dojo::model::ModelStorage;
use the_oruggin_trail::constants::zrk_constants::{ErrCode as ec};
    use the_oruggin_trail::systems::tokeniser::{tokeniser as lexer, confessor, confessor::Garble};
    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use the_oruggin_trail::models::{
        player::Player, 
        room::Room, 
        zrk_enums::{
            RoomType, room_type_to_str, 
            ActionType,  
            BiomeType, biome_type_to_str, 
            MaterialType, material_type_to_str, 
            ObjectType, object_type_to_str, 
            DirectionType, direction_type_to_str
        }, 
        txtdef::Txtdef, 
        object::Object,
        action::Action,
        inventory::Inventory
    };

    pub fn on(world: IWorldDispatcher, pid: felt252, msg: Garble) -> ByteArray {
        let mut wrld: WorldStorage =  WorldStorageTrait::new(world, @"the_oruggin_trail");

        let mut out: ByteArray = "shoggoth has got you";
        let pl: Player = wrld.read_model(pid);
        let rm: Room = wrld.read_model(pl.location.clone());
        let obj_tree: Array<felt252> = rm.objectIds.clone();
        let exit_tree: Array<felt252> = rm.dirObjIds.clone();


        if msg.iobj == ObjectType::None {
            // just run through the inventory stuff we will handle room defaults later
            let inv_id = pl.inventory;
            let inv: Inventory = wrld.read_model(inv_id);
            let inv_items: Array<felt252> = inv.items.clone();
            let inv_out: ByteArray = handle_default(wrld, inv_items.span(), msg);
            out = inv_out;
        } else {
            // this is a hack for the demo
            let act_out: ByteArray = handle_action(wrld, exit_tree.span(), msg);
            out = act_out;
        }
        out
    }

    fn pick_up(world: IWorldDispatcher, pid: felt252, msg: Garble) {

    }

    /// handle general actions
    /// 
    /// right now this is a hack and we only care about kicking the ball
    /// through a window
    fn handle_action(mut world: WorldStorage, objs: Span<felt252>, msg: Garble) -> ByteArray {
        println!("objs: {:?}", objs.len());
        let mut out: ByteArray = "well that didnt go quite as planned. literally nothing happens. pfft";
        let map: ActionType = confessor::vrb_to_response(msg.vrb.clone());

        let mut foundObj: Object = Object{
            objectId: 0, 
            objType: ObjectType::None, 
            dirType: DirectionType::None, 
            destId: 0, 
            matType: MaterialType::None, 
            objectActionIds: array![], 
            txtDefId: 0 
        };  

        println!("looking for {:?}", map);

        for ele in objs {
            println!("iter");
            let obj: Object = world.read_model(ele.clone());
            println!("obj: {}", ele);
            if obj.objType == ObjectType::Window {
                foundObj = obj;
                println!("got the window");
                break;
            }
        };

        if foundObj.objType == ObjectType::Window {
            println!("window------->");
            let act_ids: Array<felt252> = foundObj.objectActionIds.clone();
            for a_id in act_ids {
                let mut act: Action = world.read_model(a_id.clone());
                if act.actionType == ActionType::Break {
                    println!("break--->");
                    if act.enabled {
                        act.enabled = false;
                        let desc: ByteArray = "the window smashes, pieces of glass fly everywhere\nthe window falls open";
                        out = desc;
                        world.write_model(@act.clone());
                    } else {
                        let desc: ByteArray = "the ball bounces off the broken frame and then, predictably rolls into dog shit";
                    } 
                }else if act.actionType == ActionType::Open {
                    println!("open------>");
                    act.enabled = true;
                    world.write_model(@act.clone());
                }
            };
            
        } 
        out
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
        let vrb = msg.vrb.clone();
        let responds_to = confessor::vrb_to_response(vrb);
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
