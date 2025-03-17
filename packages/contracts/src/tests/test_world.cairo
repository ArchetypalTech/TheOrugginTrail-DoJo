#[cfg(test)]
pub mod test_world {
    // use dojo_cairo_test::WorldStorageTestTrait;
    use dojo::model::{ // ModelStorage,
    ModelStorageTest};
    use dojo::world::{ // WorldStorageTrait,
    WorldStorage};
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef // TestResource, ContractDefTrait, ContractDef,
    };
    // use starknet::ContractAddress;

    use the_oruggin_trail::models::{
        player::Player, room::{Room // doesRoomExist
        }, object::{Object}, inventory::Inventory,
        txtdef::Txtdef, action::Action,
        zrk_enums::{ActionType, ObjectType, DirectionType, MaterialType, RoomType, BiomeType},
    };
    use the_oruggin_trail::lib::world;

    pub fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef { namespace: "the_oruggin_trail", resources: array![].span() };
        ndef
    }

    pub fn create_test_environment() -> WorldStorage {
        let ndef = namespace_def();
        let world = spawn_test_world(array![ndef].span());
        world
    }

    pub fn setup_test_data(
        mut world: WorldStorage,
    ) -> (Player, Room, Object, Inventory, Txtdef, Action) {
        let player_id = '1000000';
        let room_id = '1000001';
        let object_id = '2000001';
        let inventory_id = '3000001';
        let txtdef_id = '4000001';
        let action_id = '5000001';
        let caller = starknet::contract_address_const::<0x1>();

        // Create test room
        let room = Room {
            roomId: room_id,
            roomType: RoomType::Room,
            biomeType: BiomeType::Forest,
            txtDefId: txtdef_id,
            shortTxt: "Test Room",
            object_ids: array![object_id],
            players: array![player_id],
        };
        world.write_model_test(@room);

        // Create test object
        let object = Object {
            inst: object_id,
            is_object: true,
            objType: ObjectType::Box,
            dirType: DirectionType::None,
            destId: 0,
            matType: MaterialType::Metal,
            objectActionIds: array![action_id],
            txtDefId: txtdef_id,
            name: "Test Object",
            altNames: array!["Alt Object", "Thing"],
        };
        world.write_model_test(@object);

        // Create test inventory
        let inventory = Inventory { owner_id: inventory_id, items: array![object_id] };
        world.write_model_test(@inventory);

        // Create test player
        let player = Player {
            player_id: player_id, player_adr: caller, location: room_id, inventory: inventory_id,
        };
        world.write_model_test(@player);

        // Create test text definition
        let txtdef = Txtdef { id: txtdef_id, owner: player_id, text: "Test Text Definition" };
        world.write_model_test(@txtdef);

        // Create test action - fixed according to actual model
        let action = Action {
            actionId: action_id,
            actionType: ActionType::Take,
            dBitTxt: "Action bit text",
            enabled: true,
            revertable: false,
            dBit: false,
            affectsActionId: 0,
            affectedByActionId: 0,
        };
        world.write_model_test(@action);

        (player, room, object, inventory, txtdef, action)
    }

    pub fn create_rig() -> (WorldStorage, Player, Room, Object, Inventory, Txtdef, Action) {
        let mut world = create_test_environment();
        let (player, room, object, inventory, txtdef, action) = setup_test_data(world);
        (world, player, room, object, inventory, txtdef, action)
    }

    #[test]
    fn test_get_room() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (player, room, _, _, _, _) = setup_test_data(world);

        // Test getRoom function
        let retrieved_room = world::getRoom(world, player);
        assert(retrieved_room.roomId == room.roomId, 'wrong room id');
        assert(retrieved_room.shortTxt == room.shortTxt, 'wrong room text');
    }

    #[test]
    fn test_get_room_by_id() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (_, room, _, _, _, _) = setup_test_data(world);

        // Test getRoomById function
        let retrieved_room = world::getRoomById(world, room.roomId);
        assert(retrieved_room.roomId == room.roomId, 'wrong room id');
        assert(retrieved_room.shortTxt == room.shortTxt, 'wrong room text');
    }

    #[test]
    fn test_get_room_objects() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (_, room, object, _, _, _) = setup_test_data(world);

        // Test getRoomObjects function
        let objects = world::getRoomObjects(world, room);
        assert(objects.len() == 1, 'wrong number of objects');
        assert(objects.at(0).inst == @object.inst, 'wrong object id');
    }

    #[test]
    fn test_get_player_inventory() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (player, _, _, inventory, _, _) = setup_test_data(world);

        // Test getPlayerInventory function
        let retrieved_inventory = world::getPlayerInventory(world, player);
        assert(retrieved_inventory.owner_id == inventory.owner_id, 'wrong inventory id');
        assert(retrieved_inventory.items.len() == 1, 'wrong number of items');
    }

    #[test]
    fn test_get_player_inventory_objects() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (player, _, object, _, _, _) = setup_test_data(world);

        // Test getPlayerInventoryObjects function
        let inventory_objects = world::getPlayerInventoryObjects(world, player);
        assert(inventory_objects.len() == 1, 'wrong number of objects');
        assert(inventory_objects.at(0).inst == @object.inst, 'wrong object id');
    }

    #[test]
    fn test_get_nearby_objects() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (player, _, object, _, _, _) = setup_test_data(world);

        // Test getNearbyObjects function
        let nearby_objects = world::getNearbyObjects(world, player);
        assert(nearby_objects.len() == 2, 'wrong number of objects');

        // First object should be the room object, second is the inventory object
        // But they're actually the same object in our test setup
        assert(nearby_objects.at(0).inst == @object.inst, 'wrong room object id');
        assert(nearby_objects.at(1).inst == @object.inst, 'wrong inv object id');
    }

    #[test]
    fn test_get_object_by_id() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (_, _, object, _, _, _) = setup_test_data(world);

        // Test getObjectById function
        let retrieved_object = world::getObjectById(world, object.inst);
        assert(retrieved_object.inst == object.inst, 'wrong object id');
        assert(retrieved_object.name == object.name, 'wrong object name');
    }

    #[test]
    fn test_get_text_definition() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (_, _, _, _, txtdef, _) = setup_test_data(world);

        // Test getTextDefinition function
        let retrieved_txtdef = world::getTextDefinition(world, txtdef.id);
        assert(retrieved_txtdef.id == txtdef.id, 'wrong txtdef id');
        assert(retrieved_txtdef.text == txtdef.text, 'wrong text');
    }

    #[test]
    fn test_get_text_by_id() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (_, _, _, _, txtdef, _) = setup_test_data(world);

        // Test getTextById function
        let text = world::getTextById(world, txtdef.id);
        assert(text == txtdef.text, 'wrong text content');
    }

    #[test]
    fn test_get_action_by_id() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (_, _, _, _, _, action) = setup_test_data(world);

        // Test getActionById function
        let retrieved_action = world::getActionById(world, action.actionId);
        assert(retrieved_action.actionId == action.actionId, 'wrong action id');
        assert(retrieved_action.dBitTxt == action.dBitTxt, 'wrong action text');
    }

    #[test]
    fn test_get_object_actions() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (_, _, object, _, _, action) = setup_test_data(world);

        // Test getObjectActions function
        let actions = world::getObjectActions(world, object.inst);
        assert(actions.len() == 1, 'wrong number of actions');
        assert(actions.at(0).actionId == @action.actionId, 'wrong action id');
    }

    #[test]
    fn test_get_object_action_of_type() {
        // Initialize test environment
        let mut world = create_test_environment();
        let (_, _, object, _, _, action) = setup_test_data(world);

        // Test getObjectActionOfType function
        let action_type = ActionType::Take;
        let retrieved_action = world::getObjectActionOfType(world, object.inst, action_type);
        assert(retrieved_action.actionId == action.actionId, 'wrong action id');
        assert(retrieved_action.actionType == action_type, 'wrong action type');
    }
}
