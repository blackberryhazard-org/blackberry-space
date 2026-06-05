const fs = require('fs');
const file = 'components/snippet-card.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix the 'use client' import issue
content = content.replace("import Link from 'next/link';\n'use client';", "'use client';\nimport Link from 'next/link';");

fs.writeFileSync(file, content);
