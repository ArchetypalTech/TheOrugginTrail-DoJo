
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod systems {
    pub mod outputter;
    pub mod meatpuppet;
    pub mod tokeniser;
    pub mod spawner;
}

// pub mod generated {
//     pub mod spawner;
// }

pub mod constants {
    pub mod zrk_constants;
}

pub mod lib {
    pub mod insult_meat;
    pub mod hash_utils;
    pub mod store;
    pub mod err_handler;
    pub mod verb_eater;
    pub mod look;
    pub mod move;
    pub mod act;
    pub mod system;
}

pub mod models {
    pub mod zrk_enums;
    pub mod output;
    pub mod player;
    pub mod txtdef;
    pub mod action;
    pub mod object;
    pub mod spawnroom;
    pub mod room;
    pub mod inventory;
}

pub mod utils {
    pub mod misc;
    // pub mod system;
}

pub mod tests {
    // pub mod test_meatpuppet_hearing;
    // pub mod test_meatpuppet_look;
    // pub mod test_meatpuppet_move;
    // pub mod test_meatpuppet_act;
    pub mod test_tokeniser;
    pub mod test_spawn_plain;
    pub mod test_spawn_pass;
    pub mod test_spawn_barn;
    pub mod test_spawn_forge;
    pub mod test_spawn_basement;
    pub mod test_rig;
}
