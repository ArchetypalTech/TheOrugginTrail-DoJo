export type Nodes = {
    readonly "input": Nodes$input;
    readonly "result": Nodes$result | undefined;
};

export type Nodes$result = {
    readonly models: {
        readonly edges: ({
            readonly node: {
                readonly id: string | null;
                readonly contractAddress: YourType_felt252 | null;
                readonly name: string | null;
                readonly classHash: YourType_felt252 | null;
            } | null;
        } | null)[] | null;
    } | null;
};

export type Nodes$input = null;

export type Nodes$artifact = {
    "name": "Nodes";
    "kind": "HoudiniQuery";
    "hash": "bf6087326d0fb29aa486329fdb6ac8f7d2f6fc3cc4ccf140581841a36dbfecbd";
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
`;
    "rootType": "World__Query";
    "stripVariables": [];
    "selection": {
        "fields": {
            "models": {
                "type": "World__ModelConnection";
                "keyRaw": "models";
                "nullable": true;
                "selection": {
                    "fields": {
                        "edges": {
                            "type": "World__ModelEdge";
                            "keyRaw": "edges";
                            "nullable": true;
                            "selection": {
                                "fields": {
                                    "node": {
                                        "type": "World__Model";
                                        "keyRaw": "node";
                                        "nullable": true;
                                        "selection": {
                                            "fields": {
                                                "id": {
                                                    "type": "ID";
                                                    "keyRaw": "id";
                                                    "visible": true;
                                                    "nullable": true;
                                                };
                                                "contractAddress": {
                                                    "type": "felt252";
                                                    "keyRaw": "contractAddress";
                                                    "nullable": true;
                                                    "visible": true;
                                                };
                                                "name": {
                                                    "type": "String";
                                                    "keyRaw": "name";
                                                    "nullable": true;
                                                    "visible": true;
                                                };
                                                "classHash": {
                                                    "type": "felt252";
                                                    "keyRaw": "classHash";
                                                    "nullable": true;
                                                    "visible": true;
                                                };
                                            };
                                        };
                                        "visible": true;
                                    };
                                };
                            };
                            "visible": true;
                        };
                    };
                };
                "visible": true;
            };
        };
    };
    "pluginData": {
        "houdini-svelte": {};
    };
    "policy": "CacheOrNetwork";
    "partial": false;
};