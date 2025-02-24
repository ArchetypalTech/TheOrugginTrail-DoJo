export default {
    "name": "Event",
    "kind": "HoudiniSubscription",
    "hash": "a1a2cee045ac38adc360b3a6c0240bbfe2c794fef459e84cd8016f38d28f0f55",

    "raw": `subscription Event {
  eventEmitted {
    id
    keys
  }
}
`,

    "rootType": "World__Subscription",
    "stripVariables": [],

    "selection": {
        "fields": {
            "eventEmitted": {
                "type": "World__Event",
                "keyRaw": "eventEmitted",

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
                        }
                    }
                },

                "visible": true
            }
        }
    },

    "pluginData": {
        "houdini-svelte": {}
    }
};

"HoudiniHash=69f3d3ab8a40c121230a1508bb29ed696cd0279476bb9abd70feb4fd3a0edcd2";