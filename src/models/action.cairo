use the_oruggin_trail::models::{zrk_enums as zrk};

#[derive(Clone, Drop, Serde)]
#[dojo::model]
struct Action {
    #[key]
    actionId: felt252,
    actionType: zrk::ActionType,
    dBitTxt: ByteArray, // when the bit is set then output this
    enabled: bool,
    revertable: bool,
    dBit: bool,
    affectsActionId: felt252,
    affectedByActionId: felt252
}

fn action_mock_hash() -> felt252 {
    570569841135745306506513556879415971252297628232229127693536224532629374082
}