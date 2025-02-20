#!/bin/bash

set -euo pipefail

# Change the current working directory to the parent directory of the script
pushd "$(dirname "$0")/.." >/dev/null
echo "Running in $(PWD)"

# Function to check if a program exists
check_program() {
  if ! command -v "$1" &>/dev/null; then
    echo "Error: $1 is not installed."
    return 1
  else
    echo "Found $1"
    P_VAR=$1
    return 0
  fi
}


check_env() {
    if [ -z "${!1}" ]; then
        echo "Environment variable '$1' is not set."
        return 1
    else

        echo "Environment variable '$1' is set to '${!1}'."
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
        local cmd=$1
        shift
        local params=("$@")
        "$cmd" "${params[@]}" >"$log_path" &
        pid=$!
        if [ "$P_VAR" == "katana" ]; then
          KL_PATH="${log_path}"
          echo "Setting KL_PATH: ${KL_PATH}"
        elif [ "$P_VAR" == "torii" ]; then
          TL_PATH="${log_path}"
          echo "Setting TL_PATH: ${TL_PATH}"
        fi
        echo "$cmd backgrounded with pid:$pid"
        echo "LOG: ${log_path}"
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

# called with 2 params
# toml_path in $1
# wrld_addr in #2 where the addr_str is the new world_address
add_new_address() {
  local filename="$1"
  local new_hex_string="$2"
  local new_line_content="world_address = \"$2\""
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i "" "/^world_address/s/.*/$new_line_content/" $filename
  else
    sed -i "/^world_address/s/.*/$new_line_content/" $filename
  fi
}

deploy_local() {
  echo "foo"
  out=$(sozo migrate apply)
  local status=$?
  echo "bar"

  if [ $status -eq 0 ]; then
    addr=$(echo "$out" | grep "Successfully migrated World" | awk '{print $NF}')
    echo $addr
    # echo -n $out
  else
    err_handler "$0" "$?"
  fi
}

cleanup() {
  local processes=("katana" "torii") # Example process names
  for process in "${processes[@]}"; do
    echo "PKILL $process..."
    pkill "$process" || echo "Failed to kill $process e: $?, continuing..."
  done
}

build_manifest() {
    echo "Starting build..."
    run_command "sozo" "build"
}

# Function to run the build chain
run() {
  echo "Starting build..."
  run_command "sozo" "build"
  echo "Testing for local katana"
  if ! pgrep -x "katana" >/dev/null; then
    echo "Starting katana"
    # comment_toml dojo_dev.toml
    run_background_command "katana" "--disable-fee" "--allowed-origins" "*"
    wait_for_server 5050
  fi
  echo "Running local deployment..."
  ad=$(deploy_local)
  echo "Found World Addr: $ad"
  # uncomment_toml dojo_dev.toml
  echo "Amending dojo_dev.toml"
  add_new_address dojo_dev.toml "$ad"
  echo "Testing for torii"
  if ! pgrep -x "torii"; then
    echo "Starting torii with world $ad"
    run_background_command "torii" "--world" "$ad" "-d" "local.db" "--allowed-origins" "*"
    wait_for_server 8080
  fi
  echo "build complete..."
  # echo "Setting auth..."
  set_auth
  popd >/dev/null
  echo "Tailing logs"
  mprocs "tail -f ${KL_PATH}" "tail -f ${TL_PATH}"
}

copy_contract_manifests() {
    echo "PWD: $(pwd)"
    target="target/dev"

    if [ -d "$target" ] && [ -n "$(shopt -s nullglob dotglob; echo $target*)" ]; then
        echo "Bingo. Found $(pwd)/target/dir"
    else
        echo "Directory is empty."
    fi
}

# we domnt need this anymore, now ca be done by an overlay
# and anyway its a carpet bomb
set_auth() {
  local rpc='http://localhost:5050'
  local world=$(cat ./manifests/dev/deployment/manifest.json | jq -r '.world.address')
  local contracts=$(cat ./manifests/dev/deployment/manifest.json | jq -r '.contracts[] | select(.kind == "DojoContract" ).tag')
  local models=("model:the_oruggin_trail-Output")
  local auth_models=""
  for mod in ${models[@]}; do
    auth_models+="$mod,$contracts "
  done
  
  sozo auth grant --world "${world}" --wait writer "${auth_models}" 

  # sozo auth grant --world $world --wait writer \
  #   Output,the_oruggin_trail::systems::meatpuppet::meatpuppet
  #>/dev/null
  echo "Default authorizations have been successfully set."
}

err_handler() {
  popd >/dev/null
  echo "Command $1 \n\tfailed: $2"
  exit 1
}

# main entry point of script
# Check for the function name passed as an argument
if declare -f "$1" >/dev/null; then
  # Call the function by passing arguments
  "$@"
else
  echo "Error: Function $1 does not exist."
  return 1
fi

# Test the return code of the program
if [ $? -ne 0 ]; then
  echo "Error: Failed to run the program."
  exit 1
fi

