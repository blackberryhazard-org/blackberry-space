## 2024-06-06 - XSS Vulnerability in Shiki Fallback

**Vulnerability:** XSS vulnerability in `components/snippet-card.tsx` due to `snippet.code` being directly interpolated into `dangerouslySetInnerHTML` in the error fallback handler for Shiki `codeToHtml`.

**Learning:** When using syntax highlighters with fallback plain-text rendering, we must escape user-supplied code snippets manually if using `dangerouslySetInnerHTML`.

**Prevention:** Always escape user input when generating HTML strings manually, or rely on React's automatic escaping by rendering text nodes instead of raw HTML when possible.
