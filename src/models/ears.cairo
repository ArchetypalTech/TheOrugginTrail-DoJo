use starknet::ContractAddress;
use the_oruggin_trail::models::zrk_enums::{ActionType, ObjectType};

#[derive(Drop, Serde)]
#[dojo::model]
struct Ears {
    #[key]
    playerId: ContractAddress,
    input_stream: Array<felt252> 
}