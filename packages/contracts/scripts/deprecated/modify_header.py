import os
import re

def process_cairo_files(directory):
    # Walk through all files in the directory
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.cairo'):
                filepath = os.path.join(root, file)
                modify_file(filepath)

def modify_file(filepath):
    # Read the file content
    with open(filepath, 'r') as file:
        content = file.read()
    
    # Define the pattern to match the copyright block
    pattern = r'(//\n// Copyright.*?\n//\n// MeaCulpa.*?\n//)'
    
    # Function to add asterisk after //
    def add_asterisk(match):
        return match.group(0).replace('//', '//*')
    
    # Replace the matched pattern
    modified_content = re.sub(pattern, add_asterisk, content, flags=re.DOTALL)
    
    # Write back to file if changes were made
    if modified_content != content:
        with open(filepath, 'w') as file:
            file.write(modified_content)
        print(f"Modified: {filepath}")

if __name__ == "__main__":
    src_directory = "src"
    process_cairo_files(src_directory)