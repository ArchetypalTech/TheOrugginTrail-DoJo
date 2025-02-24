import { EntityModelStore } from "../plugins/houdini-svelte/stores/EntityModel";
import { EventStore } from "../plugins/houdini-svelte/stores/Event";
import { NodesStore } from "../plugins/houdini-svelte/stores/Nodes";
import type { Cache as InternalCache } from "./cache/cache";
import type { CacheTypeDef } from "./generated";
import { Cache } from "./public";
export * from "./client";
export * from "./lib";

export function graphql(
    str: "\n  subscription EntityModel($id: ID!) {\n    entityUpdated(id: $id) {\n      id\n      keys\n      models {\n        __typename,\n        ... on the_oruggin_trail_Output {\n          text_o_vision\n        }\n      }\n    }\n  }\n"
): EntityModelStore;

export function graphql(
    str: "\n  subscription Event {\n    eventEmitted {\n      id\n      keys\n    }\n  }\n"
): EventStore;

export function graphql(
    str: "query Nodes{\n  models {\n    edges {\n      node {\n      \tid\n        contractAddress\n      \tname\n        classHash\n      }\n    }\n  }\n} \n"
): NodesStore;

export declare function graphql<_Payload, _Result = _Payload>(str: TemplateStringsArray): _Result;
export declare const cache: Cache<CacheTypeDef>;
export declare function getCache(): InternalCache;