# Cairo Code Generator

A TypeScript-based generator that converts JSON configuration files into Cairo smart contract code for The Oruggin Trail game.

## Prerequisites

- [Bun](https://bun.sh/) runtime installed
- Node.js 16.x or higher

## Installation

```bash
# Install dependencies
bun install
```

## Usage

The generator takes a JSON configuration file as input and produces a Cairo smart contract file as output.

```bash
bun run index.ts <input.json> <output.cairo>
```

For example:
```bash
bun run index.ts config/config.json ../src/systems/spawner.cairo
```

## Input JSON Format

The input JSON file should follow this structure:

```json
{
  "levels": [
    {
      "levelName": "string",
      "rooms": [
        {
          "roomID": number,
          "roomName": "string",
          "roomDescription": "string",
          "roomType": "WoodCabin" | "Store" | "Cavern" | /* ... other room types */,
          "biomeType": "Forest" | "Tundra" | "Arctic" | /* ... other biome types */,
          "objects": [
            {
              "objID": number,
              "type": "Path" | "Window" | "Ball" | /* ... other object types */,
              "material": "Wood" | "Dirt" | "Stone" | /* ... other material types */,
              "objDescription": "string",
              "direction": "N" | "S" | "E" | "W" | "U" | "D" | "None",
              "destination": "string" | null,
              "actions": [
                {
                  "actionID": number,
                  "type": "Move" | "Look" | "Kick" | /* ... other action types */,
                  "enabled": boolean,
                  "revertable": boolean,
                  "dBitText": "string",
                  "dBit": boolean,
                  "affectsAction": number | null
                }
              ]
            }
          ],
          "objectIds": number[],
          "dirObjIds": number[]
        }
      ]
    }
  ]
}
```

## Development

The project structure:

- `src/types.ts` - TypeScript type definitions
- `src/converter.ts` - Main conversion logic
- `index.ts` - CLI entry point

To build the project:

```bash
bun run build
```

## License

MIT
