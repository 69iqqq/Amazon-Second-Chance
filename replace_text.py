import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content.replace('Second Life', 'Second Chance').replace('2nd Life', '2nd Chance')
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        pass

for root, _, files in os.walk('c:\\Users\\abird\\personal\\HackOn\\amahawk'):
    if 'node_modules' in root or '.next' in root or '.git' in root or 'dist' in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx', '.md', '.json', '.prisma')):
            replace_in_file(os.path.join(root, file))

print("Replacement complete.")
