#!/bin/bash

# Check if a directory is provided as argument
if [ $# -ne 1 ]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

# Check if the provided path is a directory
if [ ! -d "$1" ]; then
    echo "Error: '$1' is not a directory"
    exit 1
fi

# Function to process a single file
process_file() {
    local file="$1"
    local temp_file=$(mktemp)
    
    while IFS= read -r line; do
        # Check if line contains println! and IS commented (with or without whitespace)
        if [[ $line =~ println! ]] && [[ $line =~ ^[[:space:]]*//.*|^//.* ]]; then
            # Remove // but preserve the original whitespace
            echo "${line/\/\//}" >> "$temp_file"
        else
            echo "$line" >> "$temp_file"
        fi
    done < "$file"
    
    # Replace original file with modified content
    mv "$temp_file" "$file"
    echo "Processed: $file"
}

# Find all .cairo files in the directory and its subdirectories
find "$1" -type f -name "*.cairo" | while read -r file; do
    process_file "$file"
done
