export default {
    "name": "EntityModel",
    "kind": "HoudiniSubscription",
    "hash": "cbee4ceb462df606a2316587f4c976a66f996973104a2526c0a4c65f37bb7df5",

    "raw": `subscription EntityModel($id: ID!) {
  entityUpdated(id: $id) {
    id
    keys
    models {
      __typename
      ... on the_oruggin_trail_Output {
        text_o_vision
      }
      __typename
    }
  }
}
`,

    "rootType": "World__Subscription",
    "stripVariables": [],

    "selection": {
        "fields": {
            "entityUpdated": {
                "type": "World__Entity",
                "keyRaw": "entityUpdated(id: $id)",

                "selection": {
                    "fields": {
                        "id": {
                            "type": "ID",
                            "keyRaw": "id",
                            "visible": true,
                            "nullable": true
                        },

                        "keys": {
                            "type": "String",
                            "keyRaw": "keys",
                            "nullable": true,
                            "visible": true
                        },

                        "models": {
                            "type": "ModelUnion",
                            "keyRaw": "models",
                            "nullable": true,

                            "selection": {
                                "abstractFields": {
                                    "fields": {
                                        "the_oruggin_trail_Output": {
                                            "text_o_vision": {
                                                "type": "ByteArray",
                                                "keyRaw": "text_o_vision",
                                                "nullable": true,
                                                "visible": true
                                            },

                                            "__typename": {
                                                "type": "String",
                                                "keyRaw": "__typename",
                                                "visible": true
                                            }
                                        }
                                    },

                                    "typeMap": {}
                                },

                                "fields": {
                                    "__typename": {
                                        "type": "String",
                                        "keyRaw": "__typename",
                                        "visible": true
                                    }
                                }
                            },

                            "abstract": true,
                            "visible": true
                        }
                    }
                },

                "visible": true
            }
        }
    },

    "pluginData": {
        "houdini-svelte": {}
    },

    "input": {
        "fields": {
            "id": "ID"
        },

        "types": {},
        "defaults": {},
        "runtimeScalars": {}
    }
};

"HoudiniHash=51824a90ba408cd1029dcb988190ab2f6b54e1cbd15dc2658f304d758f0c0ab2";