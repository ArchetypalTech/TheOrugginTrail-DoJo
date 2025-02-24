import os

# The header to add to each file
HEADER = """
// **************************************************************************************
// *
// * MeaCulpa (mc) 2024 lbdl | itrainspiders | Tim Storey | ZORG
// *
// **************************************************************************************
//

"""

def add_header_to_cairo_files(start_path="src"):
    # Walk through all directories starting from src
    for root, dirs, files in os.walk(start_path):
        for file in files:
            if file.endswith('.cairo'):
                file_path = os.path.join(root, file)
                
                # Read the current content
                with open(file_path, 'r') as f:
                    content = f.read()
                
                # Skip if the file already has the copyright notice
                if "Copyright (c) 2024 itrainspiders" in content:
                    print(f"Skipping {file_path} - already has header")
                    continue
                
                # Write the header + content
                with open(file_path, 'w') as f:
                    f.write(HEADER + content)
                print(f"Added header to {file_path}")

if __name__ == "__main__":
    add_header_to_cairo_files()
