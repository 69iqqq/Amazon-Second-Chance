import os
import glob
import re

base_path = r'c:\Users\abird\personal\HackOn\amahawk\apps\web\src'
files = glob.glob(base_path + '/**/*.ts', recursive=True) + glob.glob(base_path + '/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if 'use server' or 'use client' is present
    match = re.search(r'^[\'"](use server|use client)[\'"];?', content, re.MULTILINE)
    
    if match:
        directive = match.group(0)
        # If the file doesn't strictly start with the directive
        if not content.lstrip().startswith(directive):
            # Remove all occurrences of the directive
            content = content.replace(directive + '\n', '').replace(directive, '')
            # Prepend the directive to the absolute top
            new_content = directive + '\n' + content.lstrip()
            
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Fixed directive in {file}')
