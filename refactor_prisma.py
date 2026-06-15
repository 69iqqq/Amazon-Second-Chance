import os
import glob
import re

base_path = r'c:\Users\abird\personal\HackOn\amahawk\apps\web\src'
files = glob.glob(base_path + '/**/*.ts', recursive=True) + glob.glob(base_path + '/**/*.tsx', recursive=True)

for file in files:
    if file.endswith('prisma.ts'): continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'new PrismaClient()' in content:
        # Remove the import { PrismaClient } line
        content = re.sub(r'import\s*\{\s*PrismaClient\s*\}\s*from\s*\'@prisma/client\';?\s*', '', content)
        content = re.sub(r'import\s*\{\s*PrismaClient\s*\}\s*from\s*\"@prisma/client\";?\s*', '', content)
        
        # Replace the instantiation with the new import
        if 'import { prisma } from' not in content:
            content = "import { prisma } from '@/lib/prisma';\n" + content
            
        content = re.sub(r'(export\s+)?const\s+prisma\s*=\s*new\s+PrismaClient\(\);?\s*', '', content)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {file}')
print('Refactoring complete.')
