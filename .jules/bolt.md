## 2024-06-06 - Dynamic imports for heavy syntax highlighters

**Learning:** `shiki` is a heavy dependency that significantly increases the first load JS bundle size when statically imported in React components. Next.js does not automatically split it if it's imported at the top of a client component.

**Action:** Replace static `import { codeToHtml } from 'shiki'` with dynamic `const { codeToHtml } = await import('shiki')` inside the `useEffect` where it's actually used. This ensures `shiki` is only downloaded when the component mounts and the code needs highlighting, saving massive amounts of upfront JavaScript parsing and execution.
