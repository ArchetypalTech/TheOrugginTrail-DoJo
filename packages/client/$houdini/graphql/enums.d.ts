
type ValuesOf<T> = T[keyof T]
	
export declare const DedupeMatchMode: {
    readonly Variables: "Variables";
    readonly Operation: "Operation";
    readonly None: "None";
}

export type DedupeMatchMode$options = ValuesOf<typeof DedupeMatchMode>
 
export declare const OrderDirection: {
    readonly ASC: "ASC";
    readonly DESC: "DESC";
}

export type OrderDirection$options = ValuesOf<typeof OrderDirection>
 
export declare const the_oruggin_trail_ActionOrderField: {
    readonly ACTIONID: "ACTIONID";
    readonly ACTIONTYPE: "ACTIONTYPE";
    readonly AFFECTEDBYACTIONID: "AFFECTEDBYACTIONID";
    readonly AFFECTSACTIONID: "AFFECTSACTIONID";
    readonly DBIT: "DBIT";
    readonly DBITTXT: "DBITTXT";
    readonly ENABLED: "ENABLED";
    readonly REVERTABLE: "REVERTABLE";
}

export type the_oruggin_trail_ActionOrderField$options = ValuesOf<typeof the_oruggin_trail_ActionOrderField>
 
export declare const the_oruggin_trail_InventoryOrderField: {
    readonly ITEMS: "ITEMS";
    readonly OWNER_ID: "OWNER_ID";
}

export type the_oruggin_trail_InventoryOrderField$options = ValuesOf<typeof the_oruggin_trail_InventoryOrderField>
 
export declare const the_oruggin_trail_ObjectOrderField: {
    readonly DESTID: "DESTID";
    readonly DIRTYPE: "DIRTYPE";
    readonly MATTYPE: "MATTYPE";
    readonly OBJECTACTIONIDS: "OBJECTACTIONIDS";
    readonly OBJECTID: "OBJECTID";
    readonly OBJTYPE: "OBJTYPE";
    readonly TXTDEFID: "TXTDEFID";
}

export type the_oruggin_trail_ObjectOrderField$options = ValuesOf<typeof the_oruggin_trail_ObjectOrderField>
 
export declare const the_oruggin_trail_OutputOrderField: {
    readonly PLAYERID: "PLAYERID";
    readonly TEXT_O_VISION: "TEXT_O_VISION";
}

export type the_oruggin_trail_OutputOrderField$options = ValuesOf<typeof the_oruggin_trail_OutputOrderField>
 
export declare const the_oruggin_trail_PlayerOrderField: {
    readonly INVENTORY: "INVENTORY";
    readonly LOCATION: "LOCATION";
    readonly PLAYER_ADR: "PLAYER_ADR";
    readonly PLAYER_ID: "PLAYER_ID";
}

export type the_oruggin_trail_PlayerOrderField$options = ValuesOf<typeof the_oruggin_trail_PlayerOrderField>
 
export declare const the_oruggin_trail_RoomOrderField: {
    readonly BIOMETYPE: "BIOMETYPE";
    readonly DIROBJIDS: "DIROBJIDS";
    readonly OBJECTIDS: "OBJECTIDS";
    readonly PLAYERS: "PLAYERS";
    readonly ROOMID: "ROOMID";
    readonly ROOMTYPE: "ROOMTYPE";
    readonly SHORTTXT: "SHORTTXT";
    readonly TXTDEFID: "TXTDEFID";
}

export type the_oruggin_trail_RoomOrderField$options = ValuesOf<typeof the_oruggin_trail_RoomOrderField>
 
export declare const the_oruggin_trail_SpawnroomOrderField: {
    readonly ID: "ID";
    readonly ROOMS: "ROOMS";
}

export type the_oruggin_trail_SpawnroomOrderField$options = ValuesOf<typeof the_oruggin_trail_SpawnroomOrderField>
 
export declare const the_oruggin_trail_TxtdefOrderField: {
    readonly ID: "ID";
    readonly OWNER: "OWNER";
    readonly TEXT: "TEXT";
}

export type the_oruggin_trail_TxtdefOrderField$options = ValuesOf<typeof the_oruggin_trail_TxtdefOrderField>
 
export declare const World__ModelOrderField: {
    readonly CLASS_HASH: "CLASS_HASH";
    readonly NAME: "NAME";
}

export type World__ModelOrderField$options = ValuesOf<typeof World__ModelOrderField>
 