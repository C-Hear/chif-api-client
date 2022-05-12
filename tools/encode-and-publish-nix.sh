#!/usr/bin/env bash
DIRNAME=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
node $DIRNAME/../chif-api.mjs encode --manifest ${1%/}/manifest.json --chif ${1%/}.chif --download false --publish
