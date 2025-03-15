//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

pub mod tokeniser {
    use the_oruggin_trail::models::{zrk_enums::{ActionType, ObjectType, DirectionType}};

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
            || s == "down"
            || s == "n"
            || s == "s"
            || s == "e"
            || s == "w"
            || s == "u"
            || s == "d" {
            ActionType::Move
        } else if s == "look" || s == "examine" || s == "stare" {
            ActionType::Look
        } else if s == "kick" {
            ActionType::Kick
        } else if s == "fight" || s == "duel" || s == "kill" || s == "attack" {
            ActionType::Fight
        } else if s == "spawn" {
            ActionType::Spawn
        } else if s == "take" || s == "get" {
            ActionType::Take
        } else if s == "inventory" {
            ActionType::Inventory
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
        } else if s == "up" || s == "u" {
            DirectionType::Up
        } else if s == "down" || s == "d" {
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

pub mod lexer {
    use dojo::world::{WorldStorage};
    use the_oruggin_trail::lib::world;
    use the_oruggin_trail::models::{
        zrk_enums::{ActionType, ObjectType, DirectionType}, player::Player, object,
    };
    use the_oruggin_trail::constants::zrk_constants::ErrCode;
    use super::tokeniser;

    /// Garble, the main semantic message type
    ///
    /// it mainly is VRB, THING, THING (ie kick ball at troll)
    /// it can also be a MOVE, DIR (ie go north, or north) etc
    /// the later systems need to handle this specialisation
    #[derive(Serde, Copy, Drop, Introspect, Debug, PartialEq)]
    pub struct Garble {
        pub vrb: ActionType, // action command
        pub dir: DirectionType, // direction
        pub dobj: ObjectType, // dunno object
        pub iobj: ObjectType, // inventory object
        pub matchedObject: felt252,
    }

    // Parses the command string from the player, and uses world and player as context
    pub fn parse(
        message: Array<ByteArray>, world: WorldStorage, player: Player,
    ) -> Result<Garble, ErrCode> {
        // get the first token from the command
        let msg = @message;
        let verb = msg.at(0).clone();
        let action = tokeniser::str_to_AT(verb);

        // FIXME: @dev this is a temp hack for look with no object
        if action == ActionType::Look && msg.len() == 1 {
            return parse_look(msg);
        }

        // now handle the semantic analysis
        match action {
            ActionType::Move => { parse_moves(msg) },
            ActionType::None => { Result::Err(ErrCode::BadImpl) },
            _ => { parse_action(msg, action, world, player) },
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

    fn bullshit() -> Result<Garble, ErrCode> {
        Result::Err(ErrCode::BadFood)
    }

    /// General VERBS
    ///
    /// non movement and non looking verbs, i.e the general case
    fn parse_action(
        message: @Array<ByteArray>, verb: ActionType, world: WorldStorage, player: Player,
    ) -> Result<Garble, ErrCode> {
        // @dev get all the objects that are in the room and the player's inventory
        let objects = world::getNearbyObjects(world, player);
        println!("-------> parse action {:?}", verb);

        let s = message.at(message.len() - 1);
        let sn = s.clone();
        let do = tokeniser::str_to_OT(sn);

        let lng_frm = message.len() > 3;

        let mut matchedId: felt252 = 0;
        // @dev we are looking through all the words
        if (message.len() > 1) {
            let mut i: usize = 0;
            loop {
                if i >= message.len() {
                    break;
                }
                if matchedId != 0 {
                    break;
                }
                let word: ByteArray = message.at(i).clone();
                for object in objects.clone() {
                    if matchedId != 0 {
                        break;
                    }
                    let objectId = object.objectId.clone();
                    let refs: Array<ByteArray> = object::getObjectAltRefs(object);
                    println!("refs: {:?}", refs);
                    for handle in refs {
                        // @dev check if word matches the handle
                        if handle == word {
                            matchedId = objectId;
                            break;
                        }
                    }
                };
                i += 1;
            }
        }
        if matchedId != 0 {
            return Result::Ok(
                Garble {
                    vrb: verb,
                    dir: DirectionType::None,
                    dobj: ObjectType::None,
                    iobj: ObjectType::None,
                    matchedObject: matchedId,
                },
            );
        }

        // @dev probably actions should handle their own dealing with empty garble logic, we just
        // want to find stuff to interact with
        if do == ObjectType::None && message.len() < 2 {
            if verb == ActionType::Spawn || verb == ActionType::Inventory {
                Result::Ok(
                    Garble {
                        vrb: verb,
                        dir: DirectionType::None,
                        dobj: ObjectType::None,
                        iobj: ObjectType::None,
                        matchedObject: 0,
                    },
                )
            } else {
                println!("parse Err-------->");
                Result::Err(ErrCode::NulCmdO(verb))
            }
        } else if do != ObjectType::None && !lng_frm {
            Result::Ok(
                Garble {
                    vrb: verb,
                    dir: DirectionType::None,
                    dobj: do,
                    iobj: ObjectType::None,
                    matchedObject: 0,
                },
            )
        } else {
            long_form(message, verb)
        }
    }

    fn long_form(cmd: @Array<ByteArray>, at: ActionType) -> Result<Garble, ErrCode> {
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
        let do = tokeniser::str_to_OT(s);

        let s_ = cmd.at(cmd.len() - 1);
        let s = s_.clone();
        let io = tokeniser::str_to_OT(s);

        if io != ObjectType::None && do != ObjectType::None {
            //! vrb, ~the~, thing, ..., thing
            Result::Ok(
                Garble { vrb: at, dir: DirectionType::None, dobj: do, iobj: io, matchedObject: 0 },
            )
        } else {
            //! vrb, ~the~, thing, ..., ~thing~
            if io == ObjectType::None {
                Result::Ok(
                    Garble {
                        vrb: at,
                        dir: DirectionType::None,
                        dobj: do,
                        iobj: ObjectType::None,
                        matchedObject: 0,
                    },
                )
            } else {
                //! vrb, the, ?thing, ..., thing
                let s_ = cmd.at(2);
                let s = s_.clone();
                let do = tokeniser::str_to_OT(s);
                if do != ObjectType::None {
                    Result::Ok(
                        Garble {
                            vrb: at, dir: DirectionType::None, dobj: do, iobj: io, matchedObject: 0,
                        },
                    )
                } else {
                    //! vrb, the, ~thing~, ..., ~thing~
                    Result::Ok(
                        Garble {
                            vrb: at,
                            dir: DirectionType::None,
                            dobj: io,
                            iobj: ObjectType::None,
                            matchedObject: 0,
                        },
                    )
                }
            }
        }
    }

    /// LOOK command
    ///
    /// can be LOOK or LOOK AT THING, EXAMINE THING
    fn parse_look(cmd: @Array<ByteArray>) -> Result<Garble, ErrCode> {
        //! LOOK is a single action but it can be specialised to look at things
        let s = cmd.at(cmd.len() - 1);
        let s0 = s.clone();
        let t0 = tokeniser::str_to_OT(s0);

        if t0 != ObjectType::None {
            Result::Ok(
                Garble {
                    vrb: ActionType::Look,
                    dir: DirectionType::None,
                    dobj: t0,
                    iobj: ObjectType::None,
                    matchedObject: 0,
                },
            )
        } else {
            Result::Ok(
                Garble {
                    vrb: ActionType::Look,
                    dir: DirectionType::None,
                    dobj: ObjectType::None,
                    iobj: ObjectType::None,
                    matchedObject: 0,
                },
            )
        }
    }

    /// MOVE/GO commands
    ///
    /// can be GO TO THE NORTH, NORTH, GO NORTH, MOVE NORTH etc
    fn parse_moves(cmd: @Array<ByteArray>) -> Result<Garble, ErrCode> {
        let mut t: DirectionType = DirectionType::None;
        // we know we have a move type
        if cmd.len() > 1 {
            //! long form movement command
            let s = cmd.at(cmd.len() - 1);
            let s0 = s.clone();
            t = tokeniser::str_to_DT(s0);
        } else {
            //! alias form movement command
            let s = cmd.at(0);
            let s0 = s.clone();
            t = tokeniser::str_to_DT(s0);
        }

        if t == DirectionType::None {
            Result::Err(ErrCode::BadMove(ActionType::Move))
        } else {
            Result::Ok(
                Garble {
                    vrb: ActionType::Move,
                    dir: t,
                    dobj: ObjectType::None,
                    iobj: ObjectType::None,
                    matchedObject: 0,
                },
            )
        }
    }
}
