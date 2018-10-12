#! /bin/bash

SCRIPTDIR="$(dirname "$(which "$0")")"
while test $# -gt 0
do
    case "$1" in
        start) docker-compose -f $SCRIPTDIR/docker-compose.yml -p bgwe_frontend build && docker-compose -f $SCRIPTDIR/docker-compose.yml -p bgwe_frontend up -d --remove-orphans
            ;;
        stop) docker-compose -f $SCRIPTDIR/docker-compose.yml -p bgwe_frontend stop ; docker-compose -f $SCRIPTDIR/docker-compose.yml -p bgwe_frontend rm -f
            ;;
        *) echo "bad option $1"
    esac
    shift
done