## Blackberry Space — Performance Report

### Baseline vs. result
| Metric              | Before     | After      | Delta       |
|---------------------|------------|------------|-------------|
| Home page strategy  | SSR always | ISR 60s    | —           |
| Snippet view cache  | SSR always | ISR (Tag)  | —           |
| Supabase calls/req  | 3–4 seq.   | 2 parallel | -~400ms     |
| Shiki highlight     | Client CSR | Server RSC | Less CLS    |

### Changes applied
- **`src/utils/supabase/get-user.ts`**: Introduced `getUser` cached with `React.cache()` to avoid duplicate `supabase.auth.getUser()` calls in identical request lifecycles.
- **`src/app/page.tsx`**: Changed `revalidate = 0` to `60`, and implemented `Promise.all` to fetch snippets and user auth concurrently.
- **`src/app/snippets/[id]/view/page.tsx`**: Updated to `revalidate = false`, processed `shiki` highlighting server-side, and parallelized auth/snippet database fetching.
- **`src/app/profile/page.tsx`**: Parallelized data fetching for the user's profile info and favorite list.
- **`src/components/snippet-card-compact.tsx`**: Converted the UI to a Server Component to drastically reduce the client JavaScript footprint.
- **`src/components/favorite-button.tsx`**: Created a new lightweight client boundary specifically for toggling favorite state on snippet cards.
- **`src/components/navbar.tsx`**: Redesigned as a Server Component, moving interactive bits (auth/login buttons and mobile menu) into smaller leaf components.
- **`src/components/navbar-auth.tsx` & `src/components/navbar-mobile.tsx`**: New targeted client components to encapsulate navigation interactivity.
- **`src/components/active-link.tsx`**: Implemented client logic specifically to manage the active state of navigation links safely since Navbar is now a server component.
- **`src/components/snippet-card.tsx` & others**: Swapped `<img>` tags for `next/image` ensuring avatar graphics are properly sized and optimized.
- **`src/components/code-block.tsx`**: Added support for receiving `preHighlightedHtml` to bypass client-side load flashes, using it preferentially when available.
- **`next.config.ts`**: Included missing avatar domains in `remotePatterns` and added `optimizePackageImports` for `lucide-react` and `date-fns`.

### Recommended next steps
- Consider Supabase edge functions for heavy queries if TTFB remains high
- Add `revalidateTag('snippets')` in snippet creation Server Action to enable precise ISR
- Evaluate moving favorite state to Zustand + optimistic UI for snappier interactions
- Add `generateStaticParams` for top N most-viewed snippets (requires a view-count column)
