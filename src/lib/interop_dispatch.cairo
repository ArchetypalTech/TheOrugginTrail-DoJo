pub mod interop_dispatcher {
use dojo::world::{IWorldDispatcher};

    use planetary_interface::interfaces::vulcan::{
        VulcanInterface, VulcanInterfaceTrait, IVulcanSaluteDispatcher,
        IVulcanSaluteDispatcherTrait,
    };

    use planetary_interface::interfaces::pistols64::{
        Pistols64Interface, Pistols64InterfaceTrait, IPistols64ActionsDispatcher,
        IPistols64ActionsDispatcherTrait, ChallengeResults,
    };
    
    pub fn kick_off(world: @IWorldDispatcher) -> ByteArray {
        let pistols: IPistols64ActionsDispatcher = Pistols64InterfaceTrait::new().dispatcher();

        let p1 = 'Gandalf';
        let p2 = 'Elron';

        println!("Gman: {:?}", p1);

        let ps_id = get_session(pistols);        

        make_moves(pistols, ps_id);

        let outcome = get_outcome(pistols, ps_id);

        format!("WINNER IS: {:?}", outcome.winner)
    }

    fn get_output_string(msg: ChallengeResults) -> Array<ByteArray> {
        array!["foo", "bar"]
    }

    fn get_session(pistols: IPistols64ActionsDispatcher) -> u128 {
        (pistols.create_challenge('Gandalf', 'Elron', 'FIGHT'))
    }

    fn get_outcome(pistols: IPistols64ActionsDispatcher, s_id: u128) -> ChallengeResults {
        let outcome = pistols.get_challenge_results(s_id);
        // println!("id: {:?}", outcome.duel_id);
        // println!("a {:?}", outcome.duelist_name_a);
        // println!("b {:?}", outcome.duelist_name_b);
        // println!("msg {:?}", outcome.message);
        // println!("finished {:?}", outcome.is_finished);
        // println!("winner {:?}", outcome.winner);
        outcome
    }

    fn make_moves(pistols: IPistols64ActionsDispatcher, s_id: u128) {
       let moves_gandalf: Array<u8> = array![5, 8]; // 5 paces shoot, 1 paces-dodge 
       let moves_elron: Array<u8> = array![6, 2]; // 3 paces shoot, 2 paces-dodge 
       pistols.move(s_id, 1, 'Gandalf', moves_gandalf.span());
       pistols.move(s_id, 1, 'Elron', moves_elron.span());
    }
}