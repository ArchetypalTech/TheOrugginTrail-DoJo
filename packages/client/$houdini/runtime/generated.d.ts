import type { Record } from "./public/record";
import { Nodes$result, Nodes$input } from "../artifacts/Nodes";
import { NodesStore } from "../plugins/houdini-svelte/stores/Nodes";
import type { the_oruggin_trail_TxtdefOrderField } from "$houdini/graphql/enums";
import type { the_oruggin_trail_SpawnroomOrderField } from "$houdini/graphql/enums";
import type { the_oruggin_trail_RoomOrderField } from "$houdini/graphql/enums";
import type { the_oruggin_trail_PlayerOrderField } from "$houdini/graphql/enums";
import type { the_oruggin_trail_OutputOrderField } from "$houdini/graphql/enums";
import type { the_oruggin_trail_ObjectOrderField } from "$houdini/graphql/enums";
import type { the_oruggin_trail_InventoryOrderField } from "$houdini/graphql/enums";
import type { the_oruggin_trail_ActionOrderField } from "$houdini/graphql/enums";
import type { World__ModelOrderField } from "$houdini/graphql/enums";
import type { ValueOf } from "$houdini/runtime/lib/types";
import type { OrderDirection } from "$houdini/graphql/enums";

type World__ModelOrder = {
    direction: ValueOf<typeof OrderDirection>;
    field: ValueOf<typeof World__ModelOrderField>;
};

type the_oruggin_trail_ActionOrder = {
    direction: ValueOf<typeof OrderDirection>;
    field: ValueOf<typeof the_oruggin_trail_ActionOrderField>;
};

type the_oruggin_trail_ActionWhereInput = {
    actionId?: YourType_felt252 | null | undefined;
    actionIdEQ?: YourType_felt252 | null | undefined;
    actionIdGT?: YourType_felt252 | null | undefined;
    actionIdGTE?: YourType_felt252 | null | undefined;
    actionIdIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    actionIdLIKE?: YourType_felt252 | null | undefined;
    actionIdLT?: YourType_felt252 | null | undefined;
    actionIdLTE?: YourType_felt252 | null | undefined;
    actionIdNEQ?: YourType_felt252 | null | undefined;
    actionIdNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    actionIdNOTLIKE?: YourType_felt252 | null | undefined;
    actionType?: any | null | undefined;
    affectedByActionId?: YourType_felt252 | null | undefined;
    affectedByActionIdEQ?: YourType_felt252 | null | undefined;
    affectedByActionIdGT?: YourType_felt252 | null | undefined;
    affectedByActionIdGTE?: YourType_felt252 | null | undefined;
    affectedByActionIdIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    affectedByActionIdLIKE?: YourType_felt252 | null | undefined;
    affectedByActionIdLT?: YourType_felt252 | null | undefined;
    affectedByActionIdLTE?: YourType_felt252 | null | undefined;
    affectedByActionIdNEQ?: YourType_felt252 | null | undefined;
    affectedByActionIdNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    affectedByActionIdNOTLIKE?: YourType_felt252 | null | undefined;
    affectsActionId?: YourType_felt252 | null | undefined;
    affectsActionIdEQ?: YourType_felt252 | null | undefined;
    affectsActionIdGT?: YourType_felt252 | null | undefined;
    affectsActionIdGTE?: YourType_felt252 | null | undefined;
    affectsActionIdIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    affectsActionIdLIKE?: YourType_felt252 | null | undefined;
    affectsActionIdLT?: YourType_felt252 | null | undefined;
    affectsActionIdLTE?: YourType_felt252 | null | undefined;
    affectsActionIdNEQ?: YourType_felt252 | null | undefined;
    affectsActionIdNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    affectsActionIdNOTLIKE?: YourType_felt252 | null | undefined;
    dBit?: any | null | undefined;
    dBitTxt?: YourType_ByteArray | null | undefined;
    dBitTxtEQ?: YourType_ByteArray | null | undefined;
    dBitTxtGT?: YourType_ByteArray | null | undefined;
    dBitTxtGTE?: YourType_ByteArray | null | undefined;
    dBitTxtIN?: (YourType_ByteArray | null | undefined)[] | null | undefined;
    dBitTxtLIKE?: YourType_ByteArray | null | undefined;
    dBitTxtLT?: YourType_ByteArray | null | undefined;
    dBitTxtLTE?: YourType_ByteArray | null | undefined;
    dBitTxtNEQ?: YourType_ByteArray | null | undefined;
    dBitTxtNOTIN?: (YourType_ByteArray | null | undefined)[] | null | undefined;
    dBitTxtNOTLIKE?: YourType_ByteArray | null | undefined;
    enabled?: any | null | undefined;
    revertable?: any | null | undefined;
};

type the_oruggin_trail_InventoryOrder = {
    direction: ValueOf<typeof OrderDirection>;
    field: ValueOf<typeof the_oruggin_trail_InventoryOrderField>;
};

type the_oruggin_trail_InventoryWhereInput = {
    owner_id?: YourType_felt252 | null | undefined;
    owner_idEQ?: YourType_felt252 | null | undefined;
    owner_idGT?: YourType_felt252 | null | undefined;
    owner_idGTE?: YourType_felt252 | null | undefined;
    owner_idIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    owner_idLIKE?: YourType_felt252 | null | undefined;
    owner_idLT?: YourType_felt252 | null | undefined;
    owner_idLTE?: YourType_felt252 | null | undefined;
    owner_idNEQ?: YourType_felt252 | null | undefined;
    owner_idNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    owner_idNOTLIKE?: YourType_felt252 | null | undefined;
};

type the_oruggin_trail_ObjectOrder = {
    direction: ValueOf<typeof OrderDirection>;
    field: ValueOf<typeof the_oruggin_trail_ObjectOrderField>;
};

type the_oruggin_trail_ObjectWhereInput = {
    destId?: YourType_felt252 | null | undefined;
    destIdEQ?: YourType_felt252 | null | undefined;
    destIdGT?: YourType_felt252 | null | undefined;
    destIdGTE?: YourType_felt252 | null | undefined;
    destIdIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    destIdLIKE?: YourType_felt252 | null | undefined;
    destIdLT?: YourType_felt252 | null | undefined;
    destIdLTE?: YourType_felt252 | null | undefined;
    destIdNEQ?: YourType_felt252 | null | undefined;
    destIdNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    destIdNOTLIKE?: YourType_felt252 | null | undefined;
    dirType?: any | null | undefined;
    matType?: any | null | undefined;
    objType?: any | null | undefined;
    objectId?: YourType_felt252 | null | undefined;
    objectIdEQ?: YourType_felt252 | null | undefined;
    objectIdGT?: YourType_felt252 | null | undefined;
    objectIdGTE?: YourType_felt252 | null | undefined;
    objectIdIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    objectIdLIKE?: YourType_felt252 | null | undefined;
    objectIdLT?: YourType_felt252 | null | undefined;
    objectIdLTE?: YourType_felt252 | null | undefined;
    objectIdNEQ?: YourType_felt252 | null | undefined;
    objectIdNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    objectIdNOTLIKE?: YourType_felt252 | null | undefined;
    txtDefId?: YourType_felt252 | null | undefined;
    txtDefIdEQ?: YourType_felt252 | null | undefined;
    txtDefIdGT?: YourType_felt252 | null | undefined;
    txtDefIdGTE?: YourType_felt252 | null | undefined;
    txtDefIdIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    txtDefIdLIKE?: YourType_felt252 | null | undefined;
    txtDefIdLT?: YourType_felt252 | null | undefined;
    txtDefIdLTE?: YourType_felt252 | null | undefined;
    txtDefIdNEQ?: YourType_felt252 | null | undefined;
    txtDefIdNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    txtDefIdNOTLIKE?: YourType_felt252 | null | undefined;
};

type the_oruggin_trail_OutputOrder = {
    direction: ValueOf<typeof OrderDirection>;
    field: ValueOf<typeof the_oruggin_trail_OutputOrderField>;
};

type the_oruggin_trail_OutputWhereInput = {
    playerId?: YourType_felt252 | null | undefined;
    playerIdEQ?: YourType_felt252 | null | undefined;
    playerIdGT?: YourType_felt252 | null | undefined;
    playerIdGTE?: YourType_felt252 | null | undefined;
    playerIdIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    playerIdLIKE?: YourType_felt252 | null | undefined;
    playerIdLT?: YourType_felt252 | null | undefined;
    playerIdLTE?: YourType_felt252 | null | undefined;
    playerIdNEQ?: YourType_felt252 | null | undefined;
    playerIdNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    playerIdNOTLIKE?: YourType_felt252 | null | undefined;
    text_o_vision?: YourType_ByteArray | null | undefined;
    text_o_visionEQ?: YourType_ByteArray | null | undefined;
    text_o_visionGT?: YourType_ByteArray | null | undefined;
    text_o_visionGTE?: YourType_ByteArray | null | undefined;
    text_o_visionIN?: (YourType_ByteArray | null | undefined)[] | null | undefined;
    text_o_visionLIKE?: YourType_ByteArray | null | undefined;
    text_o_visionLT?: YourType_ByteArray | null | undefined;
    text_o_visionLTE?: YourType_ByteArray | null | undefined;
    text_o_visionNEQ?: YourType_ByteArray | null | undefined;
    text_o_visionNOTIN?: (YourType_ByteArray | null | undefined)[] | null | undefined;
    text_o_visionNOTLIKE?: YourType_ByteArray | null | undefined;
};

type the_oruggin_trail_PlayerOrder = {
    direction: ValueOf<typeof OrderDirection>;
    field: ValueOf<typeof the_oruggin_trail_PlayerOrderField>;
};

type the_oruggin_trail_PlayerWhereInput = {
    inventory?: YourType_felt252 | null | undefined;
    inventoryEQ?: YourType_felt252 | null | undefined;
    inventoryGT?: YourType_felt252 | null | undefined;
    inventoryGTE?: YourType_felt252 | null | undefined;
    inventoryIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    inventoryLIKE?: YourType_felt252 | null | undefined;
    inventoryLT?: YourType_felt252 | null | undefined;
    inventoryLTE?: YourType_felt252 | null | undefined;
    inventoryNEQ?: YourType_felt252 | null | undefined;
    inventoryNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    inventoryNOTLIKE?: YourType_felt252 | null | undefined;
    location?: YourType_felt252 | null | undefined;
    locationEQ?: YourType_felt252 | null | undefined;
    locationGT?: YourType_felt252 | null | undefined;
    locationGTE?: YourType_felt252 | null | undefined;
    locationIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    locationLIKE?: YourType_felt252 | null | undefined;
    locationLT?: YourType_felt252 | null | undefined;
    locationLTE?: YourType_felt252 | null | undefined;
    locationNEQ?: YourType_felt252 | null | undefined;
    locationNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    locationNOTLIKE?: YourType_felt252 | null | undefined;
    player_adr?: any | null | undefined;
    player_adrEQ?: any | null | undefined;
    player_adrGT?: any | null | undefined;
    player_adrGTE?: any | null | undefined;
    player_adrIN?: (any | null | undefined)[] | null | undefined;
    player_adrLIKE?: any | null | undefined;
    player_adrLT?: any | null | undefined;
    player_adrLTE?: any | null | undefined;
    player_adrNEQ?: any | null | undefined;
    player_adrNOTIN?: (any | null | undefined)[] | null | undefined;
    player_adrNOTLIKE?: any | null | undefined;
    player_id?: YourType_felt252 | null | undefined;
    player_idEQ?: YourType_felt252 | null | undefined;
    player_idGT?: YourType_felt252 | null | undefined;
    player_idGTE?: YourType_felt252 | null | undefined;
    player_idIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    player_idLIKE?: YourType_felt252 | null | undefined;
    player_idLT?: YourType_felt252 | null | undefined;
    player_idLTE?: YourType_felt252 | null | undefined;
    player_idNEQ?: YourType_felt252 | null | undefined;
    player_idNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    player_idNOTLIKE?: YourType_felt252 | null | undefined;
};

type the_oruggin_trail_RoomOrder = {
    direction: ValueOf<typeof OrderDirection>;
    field: ValueOf<typeof the_oruggin_trail_RoomOrderField>;
};

type the_oruggin_trail_RoomWhereInput = {
    biomeType?: any | null | undefined;
    roomId?: YourType_felt252 | null | undefined;
    roomIdEQ?: YourType_felt252 | null | undefined;
    roomIdGT?: YourType_felt252 | null | undefined;
    roomIdGTE?: YourType_felt252 | null | undefined;
    roomIdIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    roomIdLIKE?: YourType_felt252 | null | undefined;
    roomIdLT?: YourType_felt252 | null | undefined;
    roomIdLTE?: YourType_felt252 | null | undefined;
    roomIdNEQ?: YourType_felt252 | null | undefined;
    roomIdNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    roomIdNOTLIKE?: YourType_felt252 | null | undefined;
    roomType?: any | null | undefined;
    shortTxt?: YourType_ByteArray | null | undefined;
    shortTxtEQ?: YourType_ByteArray | null | undefined;
    shortTxtGT?: YourType_ByteArray | null | undefined;
    shortTxtGTE?: YourType_ByteArray | null | undefined;
    shortTxtIN?: (YourType_ByteArray | null | undefined)[] | null | undefined;
    shortTxtLIKE?: YourType_ByteArray | null | undefined;
    shortTxtLT?: YourType_ByteArray | null | undefined;
    shortTxtLTE?: YourType_ByteArray | null | undefined;
    shortTxtNEQ?: YourType_ByteArray | null | undefined;
    shortTxtNOTIN?: (YourType_ByteArray | null | undefined)[] | null | undefined;
    shortTxtNOTLIKE?: YourType_ByteArray | null | undefined;
    txtDefId?: YourType_felt252 | null | undefined;
    txtDefIdEQ?: YourType_felt252 | null | undefined;
    txtDefIdGT?: YourType_felt252 | null | undefined;
    txtDefIdGTE?: YourType_felt252 | null | undefined;
    txtDefIdIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    txtDefIdLIKE?: YourType_felt252 | null | undefined;
    txtDefIdLT?: YourType_felt252 | null | undefined;
    txtDefIdLTE?: YourType_felt252 | null | undefined;
    txtDefIdNEQ?: YourType_felt252 | null | undefined;
    txtDefIdNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    txtDefIdNOTLIKE?: YourType_felt252 | null | undefined;
};

type the_oruggin_trail_SpawnroomOrder = {
    direction: ValueOf<typeof OrderDirection>;
    field: ValueOf<typeof the_oruggin_trail_SpawnroomOrderField>;
};

type the_oruggin_trail_SpawnroomWhereInput = {
    id?: any | null | undefined;
    idEQ?: any | null | undefined;
    idGT?: any | null | undefined;
    idGTE?: any | null | undefined;
    idIN?: (any | null | undefined)[] | null | undefined;
    idLIKE?: any | null | undefined;
    idLT?: any | null | undefined;
    idLTE?: any | null | undefined;
    idNEQ?: any | null | undefined;
    idNOTIN?: (any | null | undefined)[] | null | undefined;
    idNOTLIKE?: any | null | undefined;
};

type the_oruggin_trail_TxtdefOrder = {
    direction: ValueOf<typeof OrderDirection>;
    field: ValueOf<typeof the_oruggin_trail_TxtdefOrderField>;
};

type the_oruggin_trail_TxtdefWhereInput = {
    id?: YourType_felt252 | null | undefined;
    idEQ?: YourType_felt252 | null | undefined;
    idGT?: YourType_felt252 | null | undefined;
    idGTE?: YourType_felt252 | null | undefined;
    idIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    idLIKE?: YourType_felt252 | null | undefined;
    idLT?: YourType_felt252 | null | undefined;
    idLTE?: YourType_felt252 | null | undefined;
    idNEQ?: YourType_felt252 | null | undefined;
    idNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    idNOTLIKE?: YourType_felt252 | null | undefined;
    owner?: YourType_felt252 | null | undefined;
    ownerEQ?: YourType_felt252 | null | undefined;
    ownerGT?: YourType_felt252 | null | undefined;
    ownerGTE?: YourType_felt252 | null | undefined;
    ownerIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    ownerLIKE?: YourType_felt252 | null | undefined;
    ownerLT?: YourType_felt252 | null | undefined;
    ownerLTE?: YourType_felt252 | null | undefined;
    ownerNEQ?: YourType_felt252 | null | undefined;
    ownerNOTIN?: (YourType_felt252 | null | undefined)[] | null | undefined;
    ownerNOTLIKE?: YourType_felt252 | null | undefined;
    text?: YourType_ByteArray | null | undefined;
    textEQ?: YourType_ByteArray | null | undefined;
    textGT?: YourType_ByteArray | null | undefined;
    textGTE?: YourType_ByteArray | null | undefined;
    textIN?: (YourType_ByteArray | null | undefined)[] | null | undefined;
    textLIKE?: YourType_ByteArray | null | undefined;
    textLT?: YourType_ByteArray | null | undefined;
    textLTE?: YourType_ByteArray | null | undefined;
    textNEQ?: YourType_ByteArray | null | undefined;
    textNOTIN?: (YourType_ByteArray | null | undefined)[] | null | undefined;
    textNOTLIKE?: YourType_ByteArray | null | undefined;
};

export declare type CacheTypeDef = {
    types: {
        ERC20__Token: {
            idFields: never;
            fields: {
                amount: {
                    type: string;
                    args: never;
                };
                contractAddress: {
                    type: string;
                    args: never;
                };
                decimals: {
                    type: number;
                    args: never;
                };
                name: {
                    type: string;
                    args: never;
                };
                symbol: {
                    type: string;
                    args: never;
                };
            };
            fragments: [];
        };
        ERC721__Token: {
            idFields: never;
            fields: {
                contractAddress: {
                    type: string;
                    args: never;
                };
                imagePath: {
                    type: string;
                    args: never;
                };
                metadata: {
                    type: string;
                    args: never;
                };
                metadataAttributes: {
                    type: string | null;
                    args: never;
                };
                metadataDescription: {
                    type: string | null;
                    args: never;
                };
                metadataName: {
                    type: string | null;
                    args: never;
                };
                name: {
                    type: string;
                    args: never;
                };
                symbol: {
                    type: string;
                    args: never;
                };
                tokenId: {
                    type: string;
                    args: never;
                };
            };
            fragments: [];
        };
        Token: {
            idFields: never;
            fields: {
                tokenMetadata: {
                    type: Record<CacheTypeDef, "ERC20__Token"> | Record<CacheTypeDef, "ERC721__Token">;
                    args: never;
                };
            };
            fragments: [];
        };
        TokenConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "TokenEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        TokenEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "Token"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        Token__Balance: {
            idFields: never;
            fields: {
                tokenMetadata: {
                    type: Record<CacheTypeDef, "ERC20__Token"> | Record<CacheTypeDef, "ERC721__Token">;
                    args: never;
                };
            };
            fragments: [];
        };
        Token__BalanceConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "Token__BalanceEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        Token__BalanceEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "Token__Balance"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        Token__Transfer: {
            idFields: never;
            fields: {
                executedAt: {
                    type: string;
                    args: never;
                };
                from: {
                    type: string;
                    args: never;
                };
                to: {
                    type: string;
                    args: never;
                };
                tokenMetadata: {
                    type: Record<CacheTypeDef, "ERC20__Token"> | Record<CacheTypeDef, "ERC721__Token">;
                    args: never;
                };
                transactionHash: {
                    type: string;
                    args: never;
                };
            };
            fragments: [];
        };
        Token__TransferConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "Token__TransferEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        Token__TransferEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "Token__Transfer"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__Content: {
            idFields: never;
            fields: {
                coverUri: {
                    type: string | null;
                    args: never;
                };
                description: {
                    type: string | null;
                    args: never;
                };
                iconUri: {
                    type: string | null;
                    args: never;
                };
                name: {
                    type: string | null;
                    args: never;
                };
                socials: {
                    type: ((Record<CacheTypeDef, "World__Social"> | null))[] | null;
                    args: never;
                };
                website: {
                    type: string | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__Controller: {
            idFields: {
                id: string;
            };
            fields: {
                address: {
                    type: string;
                    args: never;
                };
                deployedAt: {
                    type: any;
                    args: never;
                };
                id: {
                    type: string | null;
                    args: never;
                };
                username: {
                    type: string;
                    args: never;
                };
            };
            fragments: [];
        };
        World__ControllerConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "World__ControllerEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        World__ControllerEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "World__Controller"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__Entity: {
            idFields: {
                id: string;
            };
            fields: {
                createdAt: {
                    type: any | null;
                    args: never;
                };
                eventId: {
                    type: string | null;
                    args: never;
                };
                executedAt: {
                    type: any | null;
                    args: never;
                };
                id: {
                    type: string | null;
                    args: never;
                };
                keys: {
                    type: ((string | null))[] | null;
                    args: never;
                };
                models: {
                    type: ((Record<CacheTypeDef, "the_oruggin_trail_Action"> | Record<CacheTypeDef, "the_oruggin_trail_Inventory"> | Record<CacheTypeDef, "the_oruggin_trail_Object"> | Record<CacheTypeDef, "the_oruggin_trail_Output"> | Record<CacheTypeDef, "the_oruggin_trail_Player"> | Record<CacheTypeDef, "the_oruggin_trail_Room"> | Record<CacheTypeDef, "the_oruggin_trail_Spawnroom"> | Record<CacheTypeDef, "the_oruggin_trail_Txtdef"> | null))[] | null;
                    args: never;
                };
                updatedAt: {
                    type: any | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__EntityConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "World__EntityEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        World__EntityEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "World__Entity"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__Event: {
            idFields: {
                id: string;
            };
            fields: {
                createdAt: {
                    type: any | null;
                    args: never;
                };
                data: {
                    type: ((string | null))[] | null;
                    args: never;
                };
                executedAt: {
                    type: any | null;
                    args: never;
                };
                id: {
                    type: string | null;
                    args: never;
                };
                keys: {
                    type: ((string | null))[] | null;
                    args: never;
                };
                transactionHash: {
                    type: string | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__EventConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "World__EventEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        World__EventEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "World__Event"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__EventMessage: {
            idFields: {
                id: string;
            };
            fields: {
                createdAt: {
                    type: any | null;
                    args: never;
                };
                eventId: {
                    type: string | null;
                    args: never;
                };
                executedAt: {
                    type: any | null;
                    args: never;
                };
                id: {
                    type: string | null;
                    args: never;
                };
                keys: {
                    type: ((string | null))[] | null;
                    args: never;
                };
                models: {
                    type: ((Record<CacheTypeDef, "the_oruggin_trail_Action"> | Record<CacheTypeDef, "the_oruggin_trail_Inventory"> | Record<CacheTypeDef, "the_oruggin_trail_Object"> | Record<CacheTypeDef, "the_oruggin_trail_Output"> | Record<CacheTypeDef, "the_oruggin_trail_Player"> | Record<CacheTypeDef, "the_oruggin_trail_Room"> | Record<CacheTypeDef, "the_oruggin_trail_Spawnroom"> | Record<CacheTypeDef, "the_oruggin_trail_Txtdef"> | null))[] | null;
                    args: never;
                };
                updatedAt: {
                    type: any | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__EventMessageConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "World__EventMessageEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        World__EventMessageEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "World__EventMessage"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__Metadata: {
            idFields: {
                id: string;
            };
            fields: {
                content: {
                    type: Record<CacheTypeDef, "World__Content"> | null;
                    args: never;
                };
                coverImg: {
                    type: string | null;
                    args: never;
                };
                createdAt: {
                    type: any | null;
                    args: never;
                };
                executedAt: {
                    type: any | null;
                    args: never;
                };
                iconImg: {
                    type: string | null;
                    args: never;
                };
                id: {
                    type: string | null;
                    args: never;
                };
                updatedAt: {
                    type: any | null;
                    args: never;
                };
                uri: {
                    type: string | null;
                    args: never;
                };
                worldAddress: {
                    type: string;
                    args: never;
                };
            };
            fragments: [];
        };
        World__MetadataConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "World__MetadataEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        World__MetadataEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "World__Metadata"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__Model: {
            idFields: {
                id: string;
            };
            fields: {
                classHash: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                contractAddress: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                createdAt: {
                    type: any | null;
                    args: never;
                };
                executedAt: {
                    type: any | null;
                    args: never;
                };
                id: {
                    type: string | null;
                    args: never;
                };
                name: {
                    type: string | null;
                    args: never;
                };
                namespace: {
                    type: string | null;
                    args: never;
                };
                transactionHash: {
                    type: YourType_felt252 | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__ModelConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "World__ModelEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        World__ModelEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "World__Model"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__PageInfo: {
            idFields: never;
            fields: {
                endCursor: {
                    type: any | null;
                    args: never;
                };
                hasNextPage: {
                    type: boolean;
                    args: never;
                };
                hasPreviousPage: {
                    type: boolean;
                    args: never;
                };
                startCursor: {
                    type: any | null;
                    args: never;
                };
            };
            fragments: [];
        };
        __ROOT__: {
            idFields: {};
            fields: {
                controller: {
                    type: Record<CacheTypeDef, "World__Controller">;
                    args: {
                        id: string;
                    };
                };
                controllers: {
                    type: Record<CacheTypeDef, "World__ControllerConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                    };
                };
                entities: {
                    type: Record<CacheTypeDef, "World__EntityConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        keys?: (string | null | undefined)[] | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                    };
                };
                entity: {
                    type: Record<CacheTypeDef, "World__Entity">;
                    args: {
                        id: string;
                    };
                };
                eventMessage: {
                    type: Record<CacheTypeDef, "World__EventMessage">;
                    args: {
                        id: string;
                    };
                };
                eventMessages: {
                    type: Record<CacheTypeDef, "World__EventMessageConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        keys?: (string | null | undefined)[] | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                    };
                };
                events: {
                    type: Record<CacheTypeDef, "World__EventConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        keys?: (string | null | undefined)[] | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                    };
                };
                metadatas: {
                    type: Record<CacheTypeDef, "World__MetadataConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                    };
                };
                model: {
                    type: Record<CacheTypeDef, "World__Model">;
                    args: {
                        id: string;
                    };
                };
                models: {
                    type: Record<CacheTypeDef, "World__ModelConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                        order?: World__ModelOrder | null | undefined;
                    };
                };
                theOrugginTrailActionModels: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_ActionConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                        order?: the_oruggin_trail_ActionOrder | null | undefined;
                        where?: the_oruggin_trail_ActionWhereInput | null | undefined;
                    };
                };
                theOrugginTrailInventoryModels: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_InventoryConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                        order?: the_oruggin_trail_InventoryOrder | null | undefined;
                        where?: the_oruggin_trail_InventoryWhereInput | null | undefined;
                    };
                };
                theOrugginTrailObjectModels: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_ObjectConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                        order?: the_oruggin_trail_ObjectOrder | null | undefined;
                        where?: the_oruggin_trail_ObjectWhereInput | null | undefined;
                    };
                };
                theOrugginTrailOutputModels: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_OutputConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                        order?: the_oruggin_trail_OutputOrder | null | undefined;
                        where?: the_oruggin_trail_OutputWhereInput | null | undefined;
                    };
                };
                theOrugginTrailPlayerModels: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_PlayerConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                        order?: the_oruggin_trail_PlayerOrder | null | undefined;
                        where?: the_oruggin_trail_PlayerWhereInput | null | undefined;
                    };
                };
                theOrugginTrailRoomModels: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_RoomConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                        order?: the_oruggin_trail_RoomOrder | null | undefined;
                        where?: the_oruggin_trail_RoomWhereInput | null | undefined;
                    };
                };
                theOrugginTrailSpawnroomModels: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_SpawnroomConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                        order?: the_oruggin_trail_SpawnroomOrder | null | undefined;
                        where?: the_oruggin_trail_SpawnroomWhereInput | null | undefined;
                    };
                };
                theOrugginTrailTxtdefModels: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_TxtdefConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                        order?: the_oruggin_trail_TxtdefOrder | null | undefined;
                        where?: the_oruggin_trail_TxtdefWhereInput | null | undefined;
                    };
                };
                token: {
                    type: Record<CacheTypeDef, "Token">;
                    args: {
                        id: string;
                    };
                };
                tokenBalances: {
                    type: Record<CacheTypeDef, "Token__BalanceConnection"> | null;
                    args: {
                        accountAddress: string;
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                    };
                };
                tokenTransfers: {
                    type: Record<CacheTypeDef, "Token__TransferConnection"> | null;
                    args: {
                        accountAddress: string;
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                    };
                };
                tokens: {
                    type: Record<CacheTypeDef, "TokenConnection">;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        contractAddress?: string | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                    };
                };
                transaction: {
                    type: Record<CacheTypeDef, "World__Transaction">;
                    args: {
                        transactionHash: string;
                    };
                };
                transactions: {
                    type: Record<CacheTypeDef, "World__TransactionConnection"> | null;
                    args: {
                        after?: any | null | undefined;
                        before?: any | null | undefined;
                        first?: number | null | undefined;
                        last?: number | null | undefined;
                        limit?: number | null | undefined;
                        offset?: number | null | undefined;
                    };
                };
            };
            fragments: [];
        };
        World__Social: {
            idFields: never;
            fields: {
                name: {
                    type: string | null;
                    args: never;
                };
                url: {
                    type: string | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__Transaction: {
            idFields: {
                id: string;
            };
            fields: {
                calldata: {
                    type: ((YourType_felt252 | null))[] | null;
                    args: never;
                };
                createdAt: {
                    type: any | null;
                    args: never;
                };
                executedAt: {
                    type: any | null;
                    args: never;
                };
                id: {
                    type: string | null;
                    args: never;
                };
                maxFee: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                nonce: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                senderAddress: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                signature: {
                    type: ((YourType_felt252 | null))[] | null;
                    args: never;
                };
                transactionHash: {
                    type: YourType_felt252 | null;
                    args: never;
                };
            };
            fragments: [];
        };
        World__TransactionConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "World__TransactionEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        World__TransactionEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "World__Transaction"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_Action: {
            idFields: never;
            fields: {
                actionId: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                actionType: {
                    type: any | null;
                    args: never;
                };
                affectedByActionId: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                affectsActionId: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                dBit: {
                    type: any | null;
                    args: never;
                };
                dBitTxt: {
                    type: YourType_ByteArray | null;
                    args: never;
                };
                enabled: {
                    type: any | null;
                    args: never;
                };
                entity: {
                    type: Record<CacheTypeDef, "World__Entity"> | null;
                    args: never;
                };
                eventMessage: {
                    type: Record<CacheTypeDef, "World__EventMessage"> | null;
                    args: never;
                };
                revertable: {
                    type: any | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_ActionConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "the_oruggin_trail_ActionEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_ActionEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_Action"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_Inventory: {
            idFields: never;
            fields: {
                entity: {
                    type: Record<CacheTypeDef, "World__Entity"> | null;
                    args: never;
                };
                eventMessage: {
                    type: Record<CacheTypeDef, "World__EventMessage"> | null;
                    args: never;
                };
                items: {
                    type: ((YourType_felt252 | null))[] | null;
                    args: never;
                };
                owner_id: {
                    type: YourType_felt252 | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_InventoryConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "the_oruggin_trail_InventoryEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_InventoryEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_Inventory"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_Object: {
            idFields: never;
            fields: {
                destId: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                dirType: {
                    type: any | null;
                    args: never;
                };
                entity: {
                    type: Record<CacheTypeDef, "World__Entity"> | null;
                    args: never;
                };
                eventMessage: {
                    type: Record<CacheTypeDef, "World__EventMessage"> | null;
                    args: never;
                };
                matType: {
                    type: any | null;
                    args: never;
                };
                objType: {
                    type: any | null;
                    args: never;
                };
                objectActionIds: {
                    type: ((YourType_felt252 | null))[] | null;
                    args: never;
                };
                objectId: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                txtDefId: {
                    type: YourType_felt252 | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_ObjectConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "the_oruggin_trail_ObjectEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_ObjectEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_Object"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_Output: {
            idFields: never;
            fields: {
                entity: {
                    type: Record<CacheTypeDef, "World__Entity"> | null;
                    args: never;
                };
                eventMessage: {
                    type: Record<CacheTypeDef, "World__EventMessage"> | null;
                    args: never;
                };
                playerId: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                text_o_vision: {
                    type: YourType_ByteArray | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_OutputConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "the_oruggin_trail_OutputEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_OutputEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_Output"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_Player: {
            idFields: never;
            fields: {
                entity: {
                    type: Record<CacheTypeDef, "World__Entity"> | null;
                    args: never;
                };
                eventMessage: {
                    type: Record<CacheTypeDef, "World__EventMessage"> | null;
                    args: never;
                };
                inventory: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                location: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                player_adr: {
                    type: any | null;
                    args: never;
                };
                player_id: {
                    type: YourType_felt252 | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_PlayerConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "the_oruggin_trail_PlayerEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_PlayerEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_Player"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_Room: {
            idFields: never;
            fields: {
                biomeType: {
                    type: any | null;
                    args: never;
                };
                dirObjIds: {
                    type: ((YourType_felt252 | null))[] | null;
                    args: never;
                };
                entity: {
                    type: Record<CacheTypeDef, "World__Entity"> | null;
                    args: never;
                };
                eventMessage: {
                    type: Record<CacheTypeDef, "World__EventMessage"> | null;
                    args: never;
                };
                objectIds: {
                    type: ((YourType_felt252 | null))[] | null;
                    args: never;
                };
                players: {
                    type: ((YourType_felt252 | null))[] | null;
                    args: never;
                };
                roomId: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                roomType: {
                    type: any | null;
                    args: never;
                };
                shortTxt: {
                    type: YourType_ByteArray | null;
                    args: never;
                };
                txtDefId: {
                    type: YourType_felt252 | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_RoomConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "the_oruggin_trail_RoomEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_RoomEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_Room"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_Spawnroom: {
            idFields: {
                id: any;
            };
            fields: {
                entity: {
                    type: Record<CacheTypeDef, "World__Entity"> | null;
                    args: never;
                };
                eventMessage: {
                    type: Record<CacheTypeDef, "World__EventMessage"> | null;
                    args: never;
                };
                id: {
                    type: any | null;
                    args: never;
                };
                rooms: {
                    type: ((YourType_felt252 | null))[] | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_SpawnroomConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "the_oruggin_trail_SpawnroomEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_SpawnroomEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_Spawnroom"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_Txtdef: {
            idFields: {
                id: YourType_felt252;
            };
            fields: {
                entity: {
                    type: Record<CacheTypeDef, "World__Entity"> | null;
                    args: never;
                };
                eventMessage: {
                    type: Record<CacheTypeDef, "World__EventMessage"> | null;
                    args: never;
                };
                id: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                owner: {
                    type: YourType_felt252 | null;
                    args: never;
                };
                text: {
                    type: YourType_ByteArray | null;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_TxtdefConnection: {
            idFields: never;
            fields: {
                edges: {
                    type: ((Record<CacheTypeDef, "the_oruggin_trail_TxtdefEdge"> | null))[] | null;
                    args: never;
                };
                pageInfo: {
                    type: Record<CacheTypeDef, "World__PageInfo">;
                    args: never;
                };
                totalCount: {
                    type: number;
                    args: never;
                };
            };
            fragments: [];
        };
        the_oruggin_trail_TxtdefEdge: {
            idFields: never;
            fields: {
                cursor: {
                    type: any | null;
                    args: never;
                };
                node: {
                    type: Record<CacheTypeDef, "the_oruggin_trail_Txtdef"> | null;
                    args: never;
                };
            };
            fragments: [];
        };
    };
    lists: {};
    queries: [[NodesStore, Nodes$result, Nodes$input]];
};