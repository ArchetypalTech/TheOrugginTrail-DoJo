import type { Action, Object, Room, Level, Config } from './types';

interface ValidationError {
    type: 'RoomID' | 'ObjectID' | 'ActionID' | 'AffectsActionID';
    message: string;
    details: {
        id?: string;
        roomName?: string;
        objectType?: string;
        actionType?: string;
    };
}

export class CairoConverter {
    private convertDirection(dir: string): string {
        const dirMap: Record<string, string> = {
            'E': 'zrk::DirectionType::East',
            'S': 'zrk::DirectionType::South',
            'W': 'zrk::DirectionType::West',
            'N': 'zrk::DirectionType::North',
            'U': 'zrk::DirectionType::Up',
            'D': 'zrk::DirectionType::Down',
            'None': 'zrk::DirectionType::None'
        };
        return dirMap[dir] || 'zrk::DirectionType::None';
    }

    private convertObjectType(type: string): string {
        return `zrk::ObjectType::${type}`;
    }

    private convertActionType(type: string): string {
        return `zrk::ActionType::${type}`;
    }

    private convertMaterialType(material: string): string {
        return `zrk::MaterialType::${material}`;
    }

    private convertRoomType(type: string): string {
        return `zrk::RoomType::${type}`;
    }

    private convertBiomeType(type: string): string {
        return `zrk::BiomeType::${type}`;
    }

    private generateAction(action: Action, objId: string): string {
        const actionVar = `action_${objId}_${action.actionID}`;
        return `
        let mut ${actionVar} = Action{
            actionId: st::NONE, 
            actionType: ${this.convertActionType(action.type)},
            dBitTxt: "${action.dBitText}", 
            enabled: ${action.enabled}, 
            revertable: ${action.revertable}, 
            dBit: ${action.dBit}, 
            affectsActionId: 0,
            affectedByActionId: 0
        };

        let action_id_${objId}_${action.actionID} = h_util::action_hash(@${actionVar});
        ${actionVar}.actionId = action_id_${objId}_${action.actionID};`;
    }

    private generateObject(obj: Object): string {
        const objActions = obj.actions.map(action => this.generateAction(action, obj.objID)).join('\n');
        
        const objVar = `object_${obj.objID}`;
        const objDefinition = obj.destination 
            ? `
        let destination = "${obj.destination}";
        let mut ${objVar} = Object{
            objectId: st::SETME, 
            objType: ${this.convertObjectType(obj.type)},
            matType: ${this.convertMaterialType(obj.material)},
            dirType: ${this.convertDirection(obj.direction || 'None')},
            destId: h_util::str_hash(@destination),
            objectActionIds: array![${obj.actions.map(a => `action_id_${obj.objID}_${a.actionID}`).join(',')}],
            txtDefId: st::SETME 
        };`
            : `
        let mut ${objVar} = Object{
            objectId: st::SETME, 
            objType: ${this.convertObjectType(obj.type)},
            matType: ${this.convertMaterialType(obj.material)},
            dirType: ${this.convertDirection(obj.direction || 'None')},
            destId: st::NONE,
            objectActionIds: array![${obj.actions.map(a => `action_id_${obj.objID}_${a.actionID}`).join(',')}],
            txtDefId: st::SETME 
        };`;

        return `${objActions}
        ${objDefinition}

        let object_id_${obj.objID} = h_util::obj_hash(@${objVar}); 
        ${objVar}.objectId = object_id_${obj.objID};
        let object_desc: ByteArray = "${obj.objDescription}";
        let td_id_b = h_util::str_hash(@object_desc);
        ${objVar}.txtDefId = td_id_b;

        store_txt(w, td_id_b, object_id_${obj.objID}, object_desc);`;
    }

    private generateRoom(room: Room): string {
        const objects = room.objects.map(obj => this.generateObject(obj)).join('\n\n');

        // Create a map of all actions in the room for lookup
        const actionMap = new Map<string, { objId: string, actionId: string }>();
        room.objects.forEach(obj => {
            obj.actions.forEach(action => {
                actionMap.set(action.actionID, { objId: obj.objID, actionId: action.actionID });
            });
        });

        // Generate action affects relationships
        const actionAffects = room.objects
            .flatMap(obj => obj.actions
                .filter(action => action.affectsAction !== null)
                .map(action => {
                    const affectedAction = actionMap.get(action.affectsAction!);
                    if (!affectedAction) {
                        console.warn(`Warning: Action ${action.actionID} references non-existent action ${action.affectsAction}`);
                        return '';
                    }
                    return `
        action_${obj.objID}_${action.actionID}.affectsActionId = action_id_${affectedAction.objId}_${affectedAction.actionId};
        action_${affectedAction.objId}_${affectedAction.actionId}.affectedByActionId = action_id_${obj.objID}_${action.actionID};`;
                }))
            .filter(line => line !== '')
            .join('\n');

        const storeActions = room.objects
            .map(obj => `store_actions(w, array![${obj.actions.map(a => `action_${obj.objID}_${a.actionID}`).join(',')}]);`)
            .join('\n        ');

        const storeObjects = room.objects
            .map(obj => `store_objects(w, array![object_${obj.objID}]);`)
            .join('\n        ');

        // Automatically collect object IDs based on their type
        const staticObjects = room.objects.filter(obj => obj.destination === null);
        const directionalObjects = room.objects.filter(obj => obj.destination !== null);

        return `
    fn gen_room_${room.roomID}(w: IWorldDispatcher, playerid: felt252) {
        ${objects}
        ${actionAffects}
        ${storeActions}
        ${storeObjects}

        let room_desc: ByteArray = "${room.roomDescription}";
        let _txt_id = h_util::str_hash(@room_desc);
        let place_name: ByteArray = "${room.roomName}";
        let rmid = h_util::str_hash(@place_name);

        let mut place = Room{
            roomId: rmid,
            roomType: ${this.convertRoomType(room.roomType)},
            biomeType: ${this.convertBiomeType(room.biomeType)},
            txtDefId: _txt_id,
            shortTxt: place_name,
            objectIds: array![${staticObjects.map(obj => `object_id_${obj.objID}`).join(',')}],
            dirObjIds: array![${directionalObjects.map(obj => `object_id_${obj.objID}`).join(',')}],
            players: array![]
        };

        store_txt(w, _txt_id, rmid, room_desc);
        store_places(w, array![place]);
    }`;
    }

    private generateMakeRooms(rooms: Room[]): string {
        const roomCalls = rooms.map(room => `        let _ = gen_room_${room.roomID}(w, pl);`).join('\n');
        return `
    fn make_rooms(w: IWorldDispatcher, pl: felt252) {
${roomCalls}
    }`;
    }

    private validateConfig(config: Config): ValidationError[] {
        const errors: ValidationError[] = [];
        
        // Track all IDs for uniqueness checking
        const roomIds = new Set<string>();
        const objectIds = new Set<string>();
        const actionIds = new Set<string>();
        
        // Track ALL actions globally
        const allActionIds = new Set<string>();

        // First pass: collect all action IDs
        for (const level of config.levels) {
            for (const room of level.rooms) {
                if (roomIds.has(room.roomID)) {
                    errors.push({
                        type: 'RoomID',
                        message: `Duplicate room ID found: ${room.roomID}`,
                        details: {
                            id: room.roomID,
                            roomName: room.roomName
                        }
                    });
                }
                roomIds.add(room.roomID);

                for (const obj of room.objects) {
                    if (objectIds.has(obj.objID)) {
                        errors.push({
                            type: 'ObjectID',
                            message: `Duplicate object ID found: ${obj.objID}`,
                            details: {
                                id: obj.objID,
                                objectType: obj.type
                            }
                        });
                    }
                    objectIds.add(obj.objID);

                    for (const action of obj.actions) {
                        if (actionIds.has(action.actionID)) {
                            errors.push({
                                type: 'ActionID',
                                message: `Duplicate action ID found: ${action.actionID}`,
                                details: {
                                    id: action.actionID,
                                    actionType: action.type
                                }
                            });
                        }
                        actionIds.add(action.actionID);
                        allActionIds.add(action.actionID);
                    }
                }
            }
        }

        // Second pass: validate affectsAction references against all known actions
        for (const level of config.levels) {
            for (const room of level.rooms) {
                for (const obj of room.objects) {
                    for (const action of obj.actions) {
                        if (action.affectsAction !== null && !allActionIds.has(action.affectsAction)) {
                            errors.push({
                                type: 'AffectsActionID',
                                message: `Invalid affectsAction reference: Action ${action.actionID} references non-existent action ${action.affectsAction}`,
                                details: {
                                    id: action.actionID,
                                    actionType: action.type
                                }
                            });
                        }
                    }
                }
            }
        }

        return errors;
    }

    public convert(config: Config): string {
        // Run validation
        const validationErrors = this.validateConfig(config);
        if (validationErrors.length > 0) {
            console.error('Validation errors found:');
            validationErrors.forEach(error => {
                console.error(`[${error.type}] ${error.message}`);
                if (Object.keys(error.details).length > 0) {
                    console.error('Details:', error.details);
                }
            });
            throw new Error('Configuration validation failed. Please fix the errors above.');
        }

        const rooms = config.levels[0].rooms;
        const roomFunctions = rooms.map(room => this.generateRoom(room)).join('\n\n');
        const makeRooms = this.generateMakeRooms(rooms);

        return `#[starknet::interface]
pub trait ISpawner<T> {
    fn setup(ref self: T);
    fn spawn_player(ref self: T, pid: felt252, start_room: felt252);
}

#[dojo::contract]
pub mod spawner {
    use starknet::{ContractAddress, testing, get_caller_address};
    use core::byte_array::ByteArrayTrait;
    use core::array::ArrayTrait;
    use core::option::OptionTrait;
    use super::ISpawner;

    use the_oruggin_trail::models::{
        zrk_enums as zrk, 
        txtdef::{Txtdef}, 
        action::{Action}, 
        object::{Object}, 
        room::{Room}, 
        player::{Player},
        inventory::{Inventory}
    };

    use the_oruggin_trail::constants::zrk_constants as zc;
    use the_oruggin_trail::constants::zrk_constants::{roomid as rm, statusid as st};
    use the_oruggin_trail::lib::hash_utils::hashutils as h_util;
    use dojo::world::{IWorldDispatcher, WorldStorage, WorldStorageTrait};
    use dojo::model::{ModelStorage};

    #[abi(embed_v0)]
    pub impl SpawnerImpl of ISpawner<ContractState> {
        fn setup(ref self: ContractState) {
            let mut world = self.world(@"the_oruggin_trail");
            make_rooms(world.dispatcher, 23);
        }

        fn spawn_player(ref self: ContractState, pid: felt252, start_room: felt252) {
            let player = Player{
                player_id: pid,
                player_adr: OTHER(),
                location: start_room,
                inventory: pid
            };

            let mut world = self.world(@"the_oruggin_trail");
            let inv = Inventory {owner_id: pid, items: array![]};
            world.write_model(@inv);
            world.write_model(@player);
        }
    }

    fn OTHER() -> ContractAddress { starknet::contract_address_const::<0x2>() }

    fn store_objects(w: IWorldDispatcher, t: Array<Object>) {
        let mut world: WorldStorage = WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_actions(w: IWorldDispatcher, t: Array<Action>) {
        let mut world: WorldStorage = WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_places(w: IWorldDispatcher, t: Array<Room>) {
        let mut world: WorldStorage = WorldStorageTrait::new(w, @"the_oruggin_trail");
        for o in t {
            world.write_model(@o);
        }
    }

    fn store_txt(world: IWorldDispatcher, id: felt252, ownedBy: felt252, val: ByteArray) {
        let mut world: WorldStorage = WorldStorageTrait::new(world, @"the_oruggin_trail");
        world.write_model(@Txtdef { id: id, owner: ownedBy, text: val });
    }

${makeRooms}

${roomFunctions}
}`;
    }
} 