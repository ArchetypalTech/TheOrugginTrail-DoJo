#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;
    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    // import test utils
    use dojo::test_utils::{spawn_test_world, deploy_contract};
    // import test utils
    use the_oruggin_trail::{
        systems::{
            tokeniser::{tokeniser, ITokeniserDispatcher, ITokeniserDispatcherTrait}
            },
        models::{
            zrk_enums::{MaterialType, ActionType}
        }
    };


    #[test]
    #[available_gas(30000000)]
    fn test_actions_tokenising() {
        let caller = starknet::contract_address_const::<0x0>();
        let mut models = array![ 
            ];
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract(
                'salt', tokeniser::TEST_CLASS_HASH.try_into().unwrap(), array![].span()
            );

        // let input_arr: Array<ByteArray> = array!["kick", "ball", "at", "window"];
        let sut = ITokeniserDispatcher { contract_address };
        assert(true == false, 'fix test');
    }
}