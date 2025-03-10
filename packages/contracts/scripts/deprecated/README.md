# Scripts

Utility scripts for development

`filter-error`          : awkscript to cut down noise when running
`filter-warnings`       : awkscript to cut down noise when g

to use:
```sh
    sozosozo build | filter-warnings
```

`./utils/debug_on.sh`   : uncomments debug flags
`./utils/debug_off.sh`  : comments debug flags

## largely superseded kept for future work
`./utils/world_tests/move.sh`   : calls the move function via `sozo`
`./utils/world_tests/spawn.sh`  : calls the spawn function via `sozo`

`./utils/deploy/auth.sh`    : sets read/write auth on contracts
`./utils/deploy/default_auth.sh`    : sets read/write auth on contracts

`./utils/build/build_manifest.sh`   : builds the abi's but backgrounds the katana process
`./utils/deploy/dev_deploy.sh`  : backgrounds `torii` and `katana` and builds and deploys

`./utils/deploy/migrate`    : runs a deploy in the foreground
