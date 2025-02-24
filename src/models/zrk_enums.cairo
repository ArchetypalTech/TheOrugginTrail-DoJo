
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

/// Biome types
/// used later to generate text and seed ascii art
/// type things
#[derive(Serde, Copy, Drop, Debug, Introspect, PartialEq)]
pub enum BiomeType {
    None,
    Forest,
    Tundra,
    Arctic,
    Desert,
    Temporate,
    Faery,
    Demon,
    Mountains,
    Prarie,
}

impl BT_to_Felt252 of Into<BiomeType, felt252> {
    fn into(self: BiomeType) -> felt252 {
        match self {
            BiomeType::Forest => 'forest',
            BiomeType::Tundra => 'tundra',
            BiomeType::Arctic => 'arctic',
            BiomeType::Desert => 'desert',
            BiomeType::Temporate => 'temporate',
            BiomeType::Faery => 'faery',
            BiomeType::Demon => 'demon',
            BiomeType::None => 'none',
            BiomeType::Mountains => 'mountains',
            BiomeType::Prarie => 'prarie',
        }
    }
}

pub fn biome_type_to_str(biome_type: BiomeType) -> ByteArray {
    if biome_type == BiomeType::None {
        "none"
    } else if biome_type == BiomeType::Forest {
        "forest"
    } else if biome_type == BiomeType::Tundra {
        "tundra"
    } else if biome_type == BiomeType::Arctic {
        "arctic"
    } else if biome_type == BiomeType::Desert {
        "desert"
    } else if biome_type == BiomeType::Temporate {
        "temporate"
    } else if biome_type == BiomeType::Faery {
        "faery"
    } else if biome_type == BiomeType::Demon {
        "demon"
    } else if biome_type == BiomeType::Mountains {
        "mountains"
    } else if biome_type == BiomeType::Prarie {
        "prarie"
    } else {
        "unknown" // This case handles any potential future additions to BiomeType
    }
}


/// Room Types 
/// used by the description libs to autogen
/// description strings by composition rather
/// than being hardcoded
#[derive(Serde, Copy, Drop, Introspect, Debug, PartialEq)]
pub enum RoomType {
    None,
    WoodCabin,
    Store,
    Cavern,
    Basement,
    StoneCabin,
    Fort,
    Room,
    Plain,
    Mountains,
    Barn,
    Forge,
    Pass,
    Alley,
}

impl RT_to_Felt252 of Into<RoomType, felt252> {
    fn into(self: RoomType) -> felt252 {
        match self {
            RoomType::WoodCabin => 'wood cabin',
            RoomType::Store => 'store',
            RoomType::Cavern => 'cavern',
            RoomType::Basement => 'basement',
            RoomType::StoneCabin => 'stone cabin',
            RoomType::Fort => 'fort',
            RoomType::Plain => 'plain',
            RoomType::Room => 'room',
            RoomType::Mountains => 'mountains',
            RoomType::Barn => 'barn',
            RoomType::Forge => 'forge',
            RoomType::Pass => 'pass',
            RoomType::Alley => 'alley',
            RoomType::None => 'none',
        }
    }
}

pub fn room_type_to_str(room_type: RoomType) -> ByteArray {
    if room_type == RoomType::None {
        "none"
    } else if room_type == RoomType::WoodCabin {
        "wood cabin"
    } else if room_type == RoomType::Store {
        "store"
    } else if room_type == RoomType::Cavern {
        "cavern"
    } else if room_type == RoomType::StoneCabin {
        "stone cabin"
    } else if room_type == RoomType::Fort {
        "fort"
    } else if room_type == RoomType::Room {
        "room"
    } else if room_type == RoomType::Plain {
        "plain"
    } else if room_type == RoomType::Mountains {
        "mountains"
    } else if room_type == RoomType::Barn {
        "barn"
    } else if room_type == RoomType::Forge {
        "forge"
    } else if room_type == RoomType::Pass {
        "pass"
    } else if room_type == RoomType::Alley {
        "alley"
    } else {
        "unknown" // This case handles any potential future additions to RoomType
    }
}


/// Material Type
/// used later in the LOOK system and others to compose
/// description strings and to determine base functionality
#[derive(Serde, Copy, Drop, Introspect, Debug, PartialEq)]
pub enum MaterialType {
    None,
    Wood,
    Dirt,
    Stone,
    Flesh,
    Glass,
    IKEA,
    Iron,
    Shit,
    Mud,
    Leather,
    Metal,
    TNT,
    Hay,
}

/// MaterialType -> short_string or felt252
/// 
/// implements the Into trait and gives a <= 32 char i.e 32 * 8 bits  
impl MT_to_Felt252 of Into<MaterialType, felt252> {
    fn into(self: MaterialType) -> felt252 {
        match self {
            MaterialType::Wood => 'wood',
            MaterialType::Dirt => 'dirt',
            MaterialType::Stone => 'stone',
            MaterialType::Flesh => 'flesh',
            MaterialType::Glass => 'glass ',
            MaterialType::IKEA => 'IKEA',
            MaterialType::Iron => 'iron',
            MaterialType::Shit => 'shit',
            MaterialType::Mud => 'mud',
            MaterialType::Leather => 'leather',
            MaterialType::Metal => 'metal',
            MaterialType::TNT => 'TNT',
            MaterialType::Hay => 'hay',
            _ => 'none',
        }
    }
}

pub fn material_type_to_str(material_type: MaterialType) -> ByteArray {
    if material_type == MaterialType::None {
        "none"
    } else if material_type == MaterialType::Wood {
        "wood"
    } else if material_type == MaterialType::Dirt {
        "dirt"
    } else if material_type == MaterialType::Stone {
        "stone"
    } else if material_type == MaterialType::Flesh {
        "flesh"
    } else if material_type == MaterialType::Glass {
        "glass"
    } else if material_type == MaterialType::IKEA {
        "IKEA"
    } else if material_type == MaterialType::Iron {
        "iron"
    } else if material_type == MaterialType::Shit {
        "shit"
    } else if material_type == MaterialType::Mud {
        "mud"
    } else if material_type == MaterialType::Leather {
        "leather"
    } else if material_type == MaterialType::Metal {
        "metal"
    } else if material_type == MaterialType::TNT {
        "TNT"
    } else if material_type == MaterialType::Hay {
        "hay"
    } else {
        "unknown" // This case handles any potential future additions to MaterialType
    }
}

/// Direction Type
/// used by the direction syetm to determine movement
/// and ofc the direction of things in the world
#[derive(Serde, Copy, Drop, Introspect, Debug, PartialEq)]
pub enum DirectionType {
    None,
    North,
    East,
    South,
    West,
    Up,
    Down,
    Left,
    Right,
}

impl DT_to_Felt252 of Into<DirectionType, felt252> {
    fn into(self: DirectionType) -> felt252 {
        match self {
            DirectionType::North => 'north',
            DirectionType::East => 'east',
            DirectionType::South => 'south',
            DirectionType::West => 'west',
            DirectionType::Up => 'up',
            DirectionType::Down => 'down',
            DirectionType::Left => 'left',
            DirectionType::Right => 'right',
            DirectionType::None => 'none',
        }
    }
}

pub fn direction_type_to_str(direction_type: DirectionType) -> ByteArray {
    if direction_type == DirectionType::None {
        "none"
    } else if direction_type == DirectionType::North {
        "north"
    } else if direction_type == DirectionType::East {
        "east"
    } else if direction_type == DirectionType::South {
        "south"
    } else if direction_type == DirectionType::West {
        "west"
    } else if direction_type == DirectionType::Up {
        "up"
    } else if direction_type == DirectionType::Down {
        "down"
    } else if direction_type == DirectionType::Left {
        "left"
    } else if direction_type == DirectionType::Right {
        "right"
    } else {
        "unknown" // This case handles any potential future additions to DirectionType
    }
}

/// Action Type
/// used later in the VRB/ACTION handling system and others to compose
/// behaviour handling operations
#[derive(Serde, Drop, Copy, Destruct, Introspect, Debug, PartialEq)]
pub enum ActionType {
    None,
    Move,
    Look,
    Kick,
    Hit,
    Drink,
    Fight,
    Sleep,
    Smash,
    Pray,
    Open,
    Break,
    Burn,
    Light,
    Ignite,
    Spawn,
    Take,
    Help,
    Pour,
    Follow,
    Jump,
    Block,
    Soak,
    Empty,
    Explode,
    Disintegrate,
    Close,
    Drop,
}

impl AT_to_Felt252 of Into<ActionType, felt252> {
    fn into(self: ActionType) -> felt252 {
        match self {
            ActionType::Move => 'move',
            ActionType::Look => 'look',
            ActionType::Kick => 'kick',
            ActionType::Hit => 'hit',
            ActionType::Drink => 'drink',
            ActionType::Fight => 'fight',
            ActionType::Sleep => 'sleep',
            ActionType::Smash => 'smash',
            ActionType::Pray => 'pray',
            ActionType::Open => 'open',
            ActionType::Break => 'break',
            ActionType::Burn => 'burn',
            ActionType::Light => 'light',
            ActionType::Ignite => 'ignite',
            ActionType::Spawn => 'spawn',
            ActionType::Take => 'take',
            ActionType::Help => 'help',
            ActionType::Pour => 'pour',
            ActionType::Follow => 'follow',
            ActionType::Jump => 'jump',
            ActionType::Block => 'block',
            ActionType::Explode => 'explode',
            ActionType::Disintegrate => 'disintegrate',
            ActionType::Close => 'close',
            ActionType::Soak => 'soak',
            ActionType::Empty => 'empty',
            ActionType::Drop => 'drop',
            ActionType::None => 'none'
        }
    }
}

/// Text Definition Types
#[derive(Serde, Copy, Drop, Introspect, Debug, PartialEq)]
pub enum TxtDefType {
    None,
    DirObj,
    Dir,
    Place,
    Object,
    Action,
}

impl TDT_to_Felt252 of Into<TxtDefType, felt252> {
    fn into(self: TxtDefType) -> felt252 {
        match self {
            TxtDefType::DirObj => 'dirobj',
            TxtDefType::Dir => 'dir',
            TxtDefType::Place => 'place',
            TxtDefType::Object => 'object',
            TxtDefType::Action => 'action',
            TxtDefType::None => 'none',
        }
    }
}
/// Object Types
#[derive(Serde, Copy, Drop, Introspect, Debug, PartialEq)]
pub enum ObjectType {
    None,
    Ball,
    Window,
    Door,
    Stairs,
    Place,
    Troll,
    Path,
    Chest,
    Box,
    Matches,
    Petrol,
    Can,
    Dynamite,
    Boulder,
    Bale,
}

impl OT_to_Felt252 of Into<ObjectType, felt252> {
    fn into(self: ObjectType) -> felt252 {
        match self {
            ObjectType::None => 'none',
            ObjectType::Ball => 'ball',
            ObjectType::Window => 'window',
            ObjectType::Door => 'door',
            ObjectType::Stairs => 'stairs',
            ObjectType::Place => 'place',
            ObjectType::Troll => 'troll',
            ObjectType::Path => 'path',
            ObjectType::Chest => 'chest',
            ObjectType::Box => 'box',
            ObjectType::Matches => 'matches',
            ObjectType::Petrol => 'petrol',
            ObjectType::Can => 'can',
            ObjectType::Dynamite => 'dynamite',
            ObjectType::Boulder => 'boulder',
            ObjectType::Bale => 'bale',
        }
    }
}

pub fn object_type_to_str(object_type: ObjectType) -> ByteArray {
    if object_type == ObjectType::None {
        "none"
    } else if object_type == ObjectType::Ball {
        "ball"
    } else if object_type == ObjectType::Window {
        "window"
    } else if object_type == ObjectType::Door {
        "door"
    } else if object_type == ObjectType::Stairs {
        "stairs"
    } else if object_type == ObjectType::Place {
        "place"
    } else if object_type == ObjectType::Troll {
        "troll"
    } else if object_type == ObjectType::Path {
        "path"
    } else if object_type == ObjectType::Chest {
        "chest"
    } else if object_type == ObjectType::Matches {
        "matches"
    } else if object_type == ObjectType::Petrol {
        "petrol"
    } else if object_type == ObjectType::Can {
        "can"
    } else if object_type == ObjectType::Dynamite {
        "dynamite"
    } else if object_type == ObjectType::Boulder {
        "boulder"
    } else {
        "unknown" // This case handles any potential future additions to ObjectType
    }
}

/// Composite Verb Types
/// Represents multi-word verb phrases in English, grouped by particle
#[derive(Serde, Copy, Drop, Introspect, Debug, PartialEq)]
pub enum CompositeVerbType {
    None,
    Partial,
    // "Up" group
    PickUp,
    WakeUp,
    MakeUp,
    GiveUp,
    ComeUp,
    StandUp,
    ClimbUp,
    // "Down" group
    PutDown,
    ClimbDown,
    // "On" group
    TurnOn,
    GoOn,
    PutOn,
    HoldOn,
    // "Off" group
    TurnOff,
    TakeOff,
    CutOff,
    ShowOff,
    // "Out" group
    CheckOut,
    GetOut,
    FindOut,
    HangOut,
    PourOut,
    EmptyOut,
    // "Over" group
    TakeOver,
    GetOver,
    PullOver,
    // "Away" group
    RunAway,
    GiveAway,
    // "For" group
    LookFor,
    // "Up" with preposition
    ComeUpWith,
    // "Into" group
    RunInto,
    // "Across" group
    ComeAcross,
    // "Back" group
    ComeBack,
    // "Along" group
    GetAlong,
    // "Apart" group
    FallApart,
    // "Fire" group
    SetFire,
    // "Rid" group
    GetRid,
    // "Blow" group
    BlowUp,
    // "Bring" group
    BringUp,
}

impl CVT_to_Felt252 of Into<CompositeVerbType, felt252> {
    fn into(self: CompositeVerbType) -> felt252 {
        match self {
            CompositeVerbType::None => 'none',
            CompositeVerbType::Partial => 'partial',
            CompositeVerbType::PickUp => 'pick up',
            CompositeVerbType::WakeUp => 'wake up',
            CompositeVerbType::MakeUp => 'make up',
            CompositeVerbType::GiveUp => 'give up',
            CompositeVerbType::ComeUp => 'come up',
            CompositeVerbType::StandUp => 'stand up',
            CompositeVerbType::PutDown => 'put down',
            CompositeVerbType::TurnOn => 'turn on',
            CompositeVerbType::GoOn => 'go on',
            CompositeVerbType::PutOn => 'put on',
            CompositeVerbType::HoldOn => 'hold on',
            CompositeVerbType::TurnOff => 'turn off',
            CompositeVerbType::TakeOff => 'take off',
            CompositeVerbType::CutOff => 'cut off',
            CompositeVerbType::ShowOff => 'show off',
            CompositeVerbType::CheckOut => 'check out',
            CompositeVerbType::GetOut => 'get out',
            CompositeVerbType::FindOut => 'find out',
            CompositeVerbType::HangOut => 'hang out',
            CompositeVerbType::PourOut => 'pour out',
            CompositeVerbType::EmptyOut => 'empty out',
            CompositeVerbType::TakeOver => 'take over',
            CompositeVerbType::GetOver => 'get over',
            CompositeVerbType::PullOver => 'pull over',
            CompositeVerbType::RunAway => 'run away',
            CompositeVerbType::GiveAway => 'give away',
            CompositeVerbType::LookFor => 'look for',
            CompositeVerbType::ComeUpWith => 'come up with',
            CompositeVerbType::RunInto => 'run into',
            CompositeVerbType::ComeAcross => 'come across',
            CompositeVerbType::ComeBack => 'come back',
            CompositeVerbType::GetAlong => 'get along',
            CompositeVerbType::FallApart => 'fall apart',
            CompositeVerbType::SetFire => 'set fire',
            CompositeVerbType::GetRid => 'get rid',
            CompositeVerbType::BlowUp => 'blow up',
            CompositeVerbType::BringUp => 'bring up',
            CompositeVerbType::ClimbUp => 'climb up',
            CompositeVerbType::ClimbDown => 'climb down',
        }
    }
}

pub fn composite_verb_type_to_str(composite_verb_type: CompositeVerbType) -> ByteArray {
    match composite_verb_type {
        CompositeVerbType::None => "none",
        CompositeVerbType::Partial => "partial",
        CompositeVerbType::PickUp => "pick up",
        CompositeVerbType::WakeUp => "wake up",
        CompositeVerbType::MakeUp => "make up",
        CompositeVerbType::GiveUp => "give up",
        CompositeVerbType::ComeUp => "come up",
        CompositeVerbType::StandUp => "stand up",
        CompositeVerbType::PutDown => "put down",
        CompositeVerbType::TurnOn => "turn on",
        CompositeVerbType::GoOn => "go on",
        CompositeVerbType::PutOn => "put on",
        CompositeVerbType::HoldOn => "hold on",
        CompositeVerbType::TurnOff => "turn off",
        CompositeVerbType::TakeOff => "take off",
        CompositeVerbType::CutOff => "cut off",
        CompositeVerbType::ShowOff => "show off",
        CompositeVerbType::CheckOut => "check out",
        CompositeVerbType::GetOut => "get out",
        CompositeVerbType::FindOut => "find out",
        CompositeVerbType::HangOut => "hang out",
        CompositeVerbType::PourOut => "pour out",
        CompositeVerbType::EmptyOut => "empty out",
        CompositeVerbType::TakeOver => "take over",
        CompositeVerbType::GetOver => "get over",
        CompositeVerbType::PullOver => "pull over",
        CompositeVerbType::RunAway => "run away",
        CompositeVerbType::GiveAway => "give away",
        CompositeVerbType::LookFor => "look for",
        CompositeVerbType::ComeUpWith => "come up with",
        CompositeVerbType::RunInto => "run into",
        CompositeVerbType::ComeAcross => "come across",
        CompositeVerbType::ComeBack => "come back",
        CompositeVerbType::GetAlong => "get along",
        CompositeVerbType::FallApart => "fall apart",
        CompositeVerbType::SetFire => "set fire",
        CompositeVerbType::GetRid => "get rid",
        CompositeVerbType::BlowUp => "blow up",
        CompositeVerbType::BringUp => "bring up",
        CompositeVerbType::ClimbUp => "climb up",
        CompositeVerbType::ClimbDown => "climb down",
    }
}