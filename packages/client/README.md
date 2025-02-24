<!-- /*
 * Created on Wed Sep 04 2024
 *
 * Copyright (c) 2024 Archetypal Tech
 * MeaCulpa (mc) 2024 lbdl | itrainspiders
 */ -->

# TeamPain Client

This a minimal front end client for the [O'Ruggin Trail](https://github.com/ArchetypalTech/TheOrugginTrail-DoJo) implemenation of the ZORG engine.

It is a Svelekit and GraphQL based app wrapping [Starknet.js](https://github.com/starknet-io/starknet.js).

It also aims to present a simple tutorial for setting up the above mentioned stack for general interaction with :shinto_shrine: [Dojo](https://github.com/dojoengine/dojo) based worlds and contains some shell utilities for copying over the manifest and abi files from a dojo project, deploying itself and also deploying the cotract stack for local development.

For a simple tutorial/template for a Sveltekit/GraphQL app check out branch `pain_lessons/101`.

For a more complex version of the above (more features, etc) check out `pain_lessons/102`.

## Contents
* `scripts/` - utility scripts
* `src/` - sveltekit app

## Setup and usage
:warning: **Note** :warning:
the application needs an endpoint, if you have already built and deployed "`contracts`" you 
can ignore the following section that explains how to do this.

### Building and deploying the contracts locally
* Clone the [best game ever made](https://github.com/ArchetypalTech/TheOrugginTrail-DoJo)
* ```cd <where_did_i_clone_that_repo_to>```
* ```sozo build```
* ```katana --disable-fee --allowed-origins "*" | grep -v -e starknet_call -e starknet_blockHashAndNumber -e starknet_getBlockWithTxs```
* ```sozo migrate apply``` 
    - you need to note the world address from the output of this command
* ```torii --world <world_address> --allowed-origins "*"```

### Running the client locally
assuming that there is an instance of both `katana` and `torii` running.
* check you have endpoints running
    ```lsof -i -P -n | grep LISTEN | grep katana```
    ```lsof -i -P -n | grep LISTEN | grep torii```
* `pnpm dev` 
* `localhost:5173` & Open dev console in browser

---
## Development
when the world gets updated and assuming that the structure of the contracts the client wishes to interactwith changes then the `abi` and `manifest` files need to be updated.

* copy over manifest and abi files using `pnpm`:
    ```pnpm deploy:copy_abi_manifest``` 

* copy using the shell script:
     ```bash
    ./scripts/copy_abi_manifest.sh ../tot
    ```
    The script takes a path to the root of the dojo project as an argument. i.e. wherever you cloned out the project to.

## Utility scripts

`pnpm deploy:cp_system_abis` copies the abi json files from a dojo project, this is assumed to be at ../tot but can ofc be overidden, see `scripts/copy_abi_manifest.sh` for details as well as `package.json` where the commands are defined.

there are also a set of scripts for further code gen in the actual dojo project see [the best game in the entire universe](https://github.com/ArchetypalTech/TheOrugginTrail-DoJo).

