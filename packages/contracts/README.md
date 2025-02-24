# TheOrugginTrail
A Dojo based Zork inspired composable fully onchain text adventure engine, and a bonus game. wahay!

What lies ahead, is anyone's guess...

![ad_2_final](https://github.com/ArchetypalTech/TheOrugginTrail/assets/983878/b90bcc55-2ba1-4564-94e1-d08184c1e49c)


This project is a Zork inspired text adventure engine re-imagined onchain. It proposes and creates mechanisms for interoperabilty and composability within its and other "worlds" in an autonomous sense.

The MIT Zork design and architecture for text adventure engines eventually became the base for Infocom games and such favoured classics as Commodore64's The Hitchikers Guide To The Galaxy, one of the most ambitious and complex text adventures ever made. To get a primer and learn more about the engine and explore it's history and and the engineering principles under the hood please read these resources:

https://mud.co.uk/richard/zork.htm

https://github.com/MITDDC/zork

https://medium.com/swlh/zork-the-great-inner-workings-b68012952bdc

## Contents

This repository contains the contract code for the world. As such it contains no frontend (bite us monorepos).

Broadly the system consists of a reasonably capable  NLP parser and then further systems to handle the semantic actions derived from the parser.
The parser is largly a combination of the `src/systems/tokeniser.cairo` and `src/models/zrk_enums.cairo`. It lexes input then derives a command type (a `Garble`) which is then passed into dispatcher `/src/lib/verb_eater.cairo` which in turn passes the `garble` to it's respective handlers. 

This is largely done by considering commands as (very broadly) three types, `Movement`, `Looking`and other `stuff`. Some other `stuff` requires some specialisation in handling hence the separation of concerns.

Parsing wise the parser (which we call the `confessor`) considers commands to be of the form `DO ACTION, [to] NOUN-DIRECT, [at] NOUN-INDIRECT` like `throw the rock at the source of annoyance`.
 
This is a good example in that we can see that the `Garble` should then be `DO ACTION := 'throw', NOUN-DIRECT := 'the rock', NOUN-INDIRECT := 'the source of annoyance'`.

Lexing wise we can ignore `the` and `at the` and get `Garble{'throw', 'rock', 'source of annoyance'}` so we have some complexity with compound nouns like `source of annoyance` and `rusty key` but we can pretty much cheat in most cases using string length.

Anyway the parser currently does not currently parse for compounds, it will shortly 

Moar docs will follow. Watch This Space!

The front end is `sveltekit` with a bit of tailwind and can be found in the TeamPain [client](https://github.com/ArchetypalTech/TeamPainClient).

### Regarding composability and inter world discovery

There is a collaboration underway between Archetypal and Underware to enable composability between the Pistols64 and The O'ruggin Trail projects and other projects in the space. See the [shoggoths-planetary-deli](https://github.com/archetypaltech/shoggoths-planetary-deli) repo for more information. :eyes:

### Local development

it's a `cairo/starknet/rust` project

it uses the Dojo Framework so you'll need a working install of that tooling.

the best way to do this is using `asdf`
[asdf getting started](https://asdf-vm.com/guide/getting-started.html)

install the dojo stuff you need using asdf [dojo asdf](https://book.dojoengine.org/getting-started#install-using-asdf)
that should give you the dojo-plugin.

now install `dojo`, ⚠️ you need the dojo-plugin installed by the above link for this to work.
```sh
asdf install dojo <version>
```

you also need `scarb`
```sh 
asdf install scarb <version>
```

you should now have the right versions of the tools installed and you can check by running

```sh
asdf current
```

at the root of the repo.

you should see:
```sh
dojo    1.0.0-alpha.7   some/path/...
scarb   2.7.0   some/path/...
```

it will also say no version set for starknet-foundry but this seems not to matter.

now prepare to die from __fun__!


### running locally
* :rocket: compile contracts, generate manifest files
    ```sh
    sozo build
    ```

* :rocket: run local katana instance

    ```sh
    katana --disable-fee --allowed-origins "*" | grep -v -e starknet_call -e starknet_blockHashAndNumber -e starknet_getBlockWithTxs
    ```

* :rocket: deploy contracts to katana

    ```sh
    sozo migrate apply
    ```

* :rocket: run local torii instance

    find the world address from the katana output

    ```sh
    torii --world <world_address> --allowed-origins "*"
    ```

* :rocket: call the entrant contract via sozo

``` shell 
sozo execute --manifest-path ./tot-dojo/Scarb.toml the_oruggin_trail-meatpuppet command_shoggoth --calldata str:"look around"
```


:warning: if you are running in the root then you will need the `--manifest-path`
now prepare to die from __fun__ (again)!
