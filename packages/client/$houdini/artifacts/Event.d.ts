export type Event = {
    readonly "input": Event$input;
    readonly "result": Event$result | undefined;
};

export type Event$result = {
    readonly eventEmitted: {
        readonly id: string | null;
        readonly keys: (string | null)[] | null;
    };
};

export type Event$input = null;

export type Event$artifact = {
    "name": "Event";
    "kind": "HoudiniSubscription";
    "hash": "a1a2cee045ac38adc360b3a6c0240bbfe2c794fef459e84cd8016f38d28f0f55";
    "raw": `subscription Event {
  eventEmitted {
    id
    keys
  }
}
`;
    "rootType": "World__Subscription";
    "stripVariables": [];
    "selection": {
        "fields": {
            "eventEmitted": {
                "type": "World__Event";
                "keyRaw": "eventEmitted";
                "selection": {
                    "fields": {
                        "id": {
                            "type": "ID";
                            "keyRaw": "id";
                            "visible": true;
                            "nullable": true;
                        };
                        "keys": {
                            "type": "String";
                            "keyRaw": "keys";
                            "nullable": true;
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
};