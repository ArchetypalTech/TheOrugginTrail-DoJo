export default {
    "name": "Nodes",
    "kind": "HoudiniQuery",
    "hash": "bf6087326d0fb29aa486329fdb6ac8f7d2f6fc3cc4ccf140581841a36dbfecbd",

    "raw": `query Nodes {
  models {
    edges {
      node {
        id
        contractAddress
        name
        classHash
      }
    }
  }
}
`,

    "rootType": "World__Query",
    "stripVariables": [],

    "selection": {
        "fields": {
            "models": {
                "type": "World__ModelConnection",
                "keyRaw": "models",
                "nullable": true,

                "selection": {
                    "fields": {
                        "edges": {
                            "type": "World__ModelEdge",
                            "keyRaw": "edges",
                            "nullable": true,

                            "selection": {
                                "fields": {
                                    "node": {
                                        "type": "World__Model",
                                        "keyRaw": "node",
                                        "nullable": true,

                                        "selection": {
                                            "fields": {
                                                "id": {
                                                    "type": "ID",
                                                    "keyRaw": "id",
                                                    "visible": true,
                                                    "nullable": true
                                                },

                                                "contractAddress": {
                                                    "type": "felt252",
                                                    "keyRaw": "contractAddress",
                                                    "nullable": true,
                                                    "visible": true
                                                },

                                                "name": {
                                                    "type": "String",
                                                    "keyRaw": "name",
                                                    "nullable": true,
                                                    "visible": true
                                                },

                                                "classHash": {
                                                    "type": "felt252",
                                                    "keyRaw": "classHash",
                                                    "nullable": true,
                                                    "visible": true
                                                }
                                            }
                                        },

                                        "visible": true
                                    }
                                }
                            },

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

    "policy": "CacheOrNetwork",
    "partial": false
};

"HoudiniHash=a2d642ff1be53e553ef12eb594302336cec90c53c9506bb7b7f4cfc49b9cd3de";