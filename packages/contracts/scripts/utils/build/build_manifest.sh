#!/bin/bash

set -euo pipefail

# Change the current working directory to the parent directory of the script
pushd "$(dirname "$0")/.." >/dev/null

# Function to check if a program exists
check_program() {
    if ! command -v "$1" &>/dev/null; then
        echo "Error: $1 is not installed."
        return 1
    else
        echo "Found $1"
        return 0
    fi
}

run_command() {
    if check_program "$1"; then
        if [ "$#" -gt 2 ] || [ "$#" -eq 2 ]; then
            echo "run cmd: -- $1 ${@:2} --"
            $1 ${@:2}
        fi
    else
        err_handler "$0" "$1 not found"
    fi
}

run_background_command() {
    if check_program "$1"; then
        tmp_dir=$(mktemp -d)
        log_file="log_$1_$(date +%Y%m%d%H%M%S)_$$.log"
        pid_file="pid_$1_$(date +%Y%m%d%H%M%S)_$$.log"
        log_path="$tmp_dir/$log_file"
        pid_path="$tmp_dir/$pid_file"
        $1 ${@:2} >"$log_path" &
        pid=$!
        echo "$pid" >>$pid_path
        echo "$1 backgrounded with pid:$pid p_pth: $pid_path l_path: $log_path"
    fi
}

wait_for_server() {
    local retries=5
    local wait_time=3 # wait 5 seconds between tries

    echo "Waiting for server to start on port "$1"..."
    until nc -z localhost $1; do
        retries=$((retries - 1))
        if [ $retries -le 0 ]; then
            echo "Server failed to start in time."
            exit 1
        fi
        sleep $wait_time
    done
    echo "Server is up and running on port $1."
}

comment_toml() {
    if [[ "$(uname)" == "Darwin" ]]; then
        sed -i '' '/^world_address/s/^/#/' "$1" #we need the '' for BSD sed
    else
        sed -i '/^world_address/s/^/#/' "$1"
    fi
}

uncomment_toml() {
    if [[ "$(uname)" == "Darwin" ]]; then
        sed -i '' 's/^#world_address/world_address/' "$1" #we need the '' for BSD sed
    else
        sed -i '/^#world_address/world_address/' "$1"
    fi
}

cleanup() {
    echo "Closing backgrounded processes"
    local processes=("katana") # Example process names
    for process in "${processes[@]}"; do
        echo "PKILL $process..."
        pkill "$process" || echo "Failed to kill $process e: $?, continuing..."
    done
}

generate_manifest() {
    echo "Compiling cairo files"
    run_command "sozo" "build"
    echo "Testing for local katana"
    if ! pgrep -x "katana" >/dev/null; then
        echo "Starting katana"
        comment_toml Scarb.toml
        run_background_command "katana" "--disable-fee"
        wait_for_server 5050
    fi
    echo "Generating manifest files"
    out=$(sozo migrate apply)
    local status=$?
    uncomment_toml Scarb.toml
    if [ $status -eq 0 ]; then
        echo "Generated manifest files"
    else
        err_handler "$0" "$?"
    fi
}

err_handler() {
    popd >/dev/null
    echo "Command $1 \n\tfailed: $2"
    exit 1
}

# main entry point of script
generate_manifest 
cleanup
