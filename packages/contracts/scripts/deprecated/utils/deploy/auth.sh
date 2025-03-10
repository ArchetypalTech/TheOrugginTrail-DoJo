#!/bin/bash
# set -euo pipefail
# pushd $(dirname "$0")/..

# export RPC_URL="http://localhost:5050";

# export WORLD_ADDRESS=$(cat ./manifests/dev/manifest.json | jq -r '.world.address')

#  sozo build

#  sozo migrate apply

 sozo auth grant --world 0x7b378a92d7c10143413760513c1cded0024a02793971c8250e7ebd6531d4a58 --wait writer model:the_oruggin_trail-Output,the_oruggin_trail-meatpuppet model:the_oruggin_trail-Action,the_oruggin_trail-meatpuppet model:the_oruggin_trail-Action,the_oruggin_trail-spawner model:the_oruggin_trail-Txtdef,the_oruggin_trail-spawner model:the_oruggin_trail-Object,the_oruggin_trail-spawner model:the_oruggin_trail-Room,the_oruggin_trail-spawner model:the_oruggin_trail-Inventory,the_oruggin_trail-spawner model:the_oruggin_trail-Player,the_oruggin_trail-spawner model:the_oruggin_trail-Player,the_oruggin_trail-meatpuppet model:the_oruggin_trail-Room,the_oruggin_trail-meatpuppet model:the_oruggin_trail-Inventory,the_oruggin_trail-meatpuppet

# sozo execute --world <WORLD_ADDRESS> <CONTRACT> <ENTRYPOINT>
# sozo execute --world $WORLD_ADDRESS dojo_starter::systems::actions::actions spawn --wait
