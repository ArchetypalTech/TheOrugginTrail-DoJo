
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod tokeniser {
    use the_oruggin_trail::models::{
        zrk_enums::{ActionType, ObjectType, MaterialType, DirectionType}
    };

    /// Convert a string to an ActionType
    /// this really should use hashes, i.e felt type
    /// for ALL the types
    pub fn str_to_AT(s: ByteArray) -> ActionType {
        if s == "move"
            || s == "go"
            || s == "north"
            || s == "south"
            || s == "east"
            || s == "west"
            || s == "up"
            || s == "down" {
            ActionType::Move
        } else if s == "look" || s == "examine" || s == "stare" {
            ActionType::Look
        } else if s == "kick" {
            ActionType::Kick
        } else if s == "fight" || s == "duel" || s == "kill" || s == "attack" {
            ActionType::Fight
        } else if s == "spawn" {
            ActionType::Spawn
        }  else if s == "take" || s == "get" {
            ActionType::Take
        } else if s == "help" {
            ActionType::Help
        } else if s == "follow" {
            ActionType::Follow
        } else if s == "jump" {
            ActionType::Jump
        } else if s == "block" {
            ActionType::Block
        } else if s == "soak" {
            ActionType::Soak
        } else if s == "close" {
            ActionType::Close
        } else if s == "drop" {
            ActionType::Drop
        } else {
            ActionType::None
        }
    }

    pub fn str_to_DT(s: ByteArray) -> DirectionType {
        if s == "north" || s == "n" {
            DirectionType::North
        } else if s == "south" || s == "s" {
            DirectionType::South
        } else if s == "east" || s == "e" {
            DirectionType::East
        } else if s == "west" || s == "w" {
            DirectionType::West
        } else if s == "up" {
            DirectionType::Up
        } else if s == "down" {
            DirectionType::Down
        } else {
            DirectionType::None
        }
    }

    pub fn str_to_OT(s: ByteArray) -> ObjectType {
        if s == "ball" {
            ObjectType::Ball
        } else if s == "matches" || s == "matchbox" {
            ObjectType::Matches
        } else if s == "petrol" || s == "can" {
            ObjectType::Petrol
        } else if s == "window" {
            ObjectType::Window
        } else if s == "door" {
            ObjectType::Door
        } else if s == "troll" {
            ObjectType::Troll
        } else if s == "dynamite" {
            ObjectType::Dynamite
        } else {
            ObjectType::None
        }
    }
}

pub mod confessor {
    use the_oruggin_trail::models::{
        zrk_enums::{ActionType, ObjectType, MaterialType, DirectionType}
    };
    use the_oruggin_trail::constants::zrk_constants::ErrCode as ec;
    use super::tokeniser as lexer;

    /// Garble, the main semantic message type
    /// 
    /// it mainly is VRB, THING, THING (ie kick ball at troll)
    /// it can also be a MOVE, DIR (ie go north, or north) etc
    /// the later systems need to handle this specialisation
    #[derive(Serde, Copy, Drop, Introspect, Debug, PartialEq)]
    pub struct Garble {
      pub vrb: ActionType,
      pub dir: DirectionType,
      pub dobj: ObjectType,
      pub iobj: ObjectType,
    }

    /// The Confessor - mumble your shameful desires here and receive a message
    /// 
    /// the main entrance of the parsing system, takes an array of str
    /// and then lexes and runs semantic analysis on the lexed tokens
    /// to extract meaning and create a simple message type that can be
    /// passed around the system logic to make things happen in the world
    pub fn confess(sin: Array<ByteArray>) -> Result<Garble, ec> {
        // get the first token from the command
        let snap = @sin;
        let i0 = snap.at(0);
        let s0 = i0.clone();
        let t0 = lexer::str_to_AT(s0);

        // now handle the semantic analysis
        match t0 {
            ActionType::Move => { parse_moves(snap) },
            ActionType::Look => { parse_look(snap) },
            ActionType::None => { Result::Err(ec::BadImpl) },
            _ => { parse_action(snap, t0) },
        }
    }

    /// map a verb to a response
    /// 
    /// objects that respond to vrbs get a corresponding action
    /// type. i.e. a kick will map to a break action
    /// so if want a breakable window then we add a break action
    /// to the object and then if a direct object, say a ball has
    /// a kick action then the engine will look for its response mapping
    /// a break action or indeed whatever is set below and if the indirect
    /// object has a break action then we break the window etc.
    pub fn vrb_to_response(vrb: ActionType) -> ActionType {
        if vrb == ActionType::Kick {
            ActionType::Break
        } else if vrb == ActionType::Light {
            ActionType::Burn
        } else if vrb == ActionType::Empty || vrb == ActionType::Pour {
            ActionType::Soak
        } else if vrb == ActionType::Explode {
            ActionType::Disintegrate
        } else {
            ActionType::None
        }
    }

    fn bullshit() -> Result<Garble, ec> {
          Result::Err(ec::BadFood)
    }

    /// General VERBS
    /// 
    /// non movement and non looking verbs, i.e the general case 
    fn parse_action(cmd: @Array<ByteArray>, at: ActionType) -> Result<Garble, ec> {
        // let mut do: ObjectType = ObjectType::None;
        // let mut io: ObjectType = ObjectType::None;
        println!("-------> parse action {:?}", at);

        let s = cmd.at(cmd.len() - 1);
        let sn = s.clone();
        let do = lexer::str_to_OT(sn);

        let lng_frm = cmd.len() > 3;

        if do == ObjectType::None && cmd.len() < 2 {
            if at == ActionType::Spawn || at == ActionType::Help {
               Result::Ok( Garble{ vrb: at, dir: DirectionType::None, dobj: ObjectType::None, iobj: ObjectType::None} ) 
            } else {
                println!("parse Err-------->");
                Result::Err(ec::NulCmdO(at))
            }
        } else if do != ObjectType::None && !lng_frm {
            Result::Ok(
                Garble { vrb: at, dir: DirectionType::None, dobj: do, iobj: ObjectType::None, }
            )
        } else {
            long_form(cmd, at)
        }
    }

    fn long_form(cmd: @Array<ByteArray>, at: ActionType) -> Result<Garble, ec> {
        //! verb, [the], thing, (at | to | with), [the], thing  
        //! this currently checks for direct article by assuming that if tok[2] is
        //! an object then there is a direct article, we should probaly actually check
        //! so that we can give better errors.
        //! see the final case, `vrb, the, ~thing~, ..., ~thing~`
        //! we dont really know if it's a `the` so we just use the final
        //! token as a direct object. The same is true for the `at` preposition
        //! in case vrb, ~the~, thing, ..., ~thing~
        //! again we don't actually check. We should    
        let s_ = cmd.at(1);
        let s = s_.clone();
        let do = lexer::str_to_OT(s);

        let s_ = cmd.at(cmd.len() - 1);
        let s = s_.clone();
        let io = lexer::str_to_OT(s);

        if io != ObjectType::None && do != ObjectType::None {
            //! vrb, ~the~, thing, ..., thing
            Result::Ok(Garble { vrb: at, dir: DirectionType::None, dobj: do, iobj: io, })
        } else {
            //! vrb, ~the~, thing, ..., ~thing~
            if io == ObjectType::None {
                Result::Ok(
                    Garble{
                        vrb: at,
                        dir: DirectionType::None,
                        dobj: do,
                        iobj: ObjectType::None,
                    }
                )
            } else {
               //! vrb, the, ?thing, ..., thing 
                let s_ = cmd.at(2);
                let s = s_.clone();
                let do = lexer::str_to_OT(s);       
                if do != ObjectType::None {
                    Result::Ok(
                        Garble { 
                            vrb: at, 
                            dir: DirectionType::None, 
                            dobj: do, 
                            iobj: io, 
                        }
                    )
                } else {
                    //! vrb, the, ~thing~, ..., ~thing~
                    Result::Ok(
                        Garble { 
                            vrb: at, 
                            dir: DirectionType::None, 
                            dobj: io, 
                            iobj: ObjectType::None, 
                        }
                    )
                }
            }
        }
    }

    /// LOOK command
    /// 
    /// can be LOOK or LOOK AT THING, EXAMINE THING
    fn parse_look(cmd: @Array<ByteArray>) -> Result<Garble, ec> {
        //! LOOK is a single action but it can be specialised to look at things
        let s = cmd.at(cmd.len() - 1);
        let s0 = s.clone();
        let t0 = lexer::str_to_OT(s0);

        if t0 != ObjectType::None {
            Result::Ok(
                Garble {
                    vrb: ActionType::Look,
                    dir: DirectionType::None,
                    dobj: t0,
                    iobj: ObjectType::None,
                }
            )
        } else {
            Result::Ok(
                Garble {
                    vrb: ActionType::Look,
                    dir: DirectionType::None,
                    dobj: ObjectType::None,
                    iobj: ObjectType::None,
                }
            )
        }
    }

    /// MOVE/GO commands
    /// 
    /// can be GO TO THE NORTH, NORTH, GO NORTH, MOVE NORTH etc
    fn parse_moves(cmd: @Array<ByteArray>) -> Result<Garble, ec> {
        let mut t: DirectionType = DirectionType::None;
        // we know we have a move type 
        if cmd.len() > 1 {
            //! long form movement command
            let s = cmd.at(cmd.len() - 1);
            let s0 = s.clone();
            t = lexer::str_to_DT(s0);
        } else {
            //! alias form movement command
            let s = cmd.at(0);
            let s0 = s.clone();
            t = lexer::str_to_DT(s0);
        }

        if t == DirectionType::None {
            Result::Err(ec::BadMove(ActionType::Move))
        } else {
            Result::Ok(
                Garble {
                    vrb: ActionType::Move, dir: t, dobj: ObjectType::None, iobj: ObjectType::None
                }
            )
        }
    }
}
