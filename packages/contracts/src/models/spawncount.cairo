
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

#[derive(Copy, Drop, Serde)]
    #[dojo::model]
    pub struct Spawncount {
        #[key]
        pub id: felt252,
        pub a_c: felt252,
        pub d_c: felt252,
        pub o_c: felt252,
        pub t_c: felt252,
