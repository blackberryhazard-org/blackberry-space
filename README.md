# Blackberry Space

A platform for developers to share code snippets and solve programming challenges.

Built with **Next.js 15 (App Router)**, **Supabase** (GitHub OAuth + Postgres), and **Tailwind CSS**.

## Run Locally

**Prerequisites:** Node.js 18+ and a [Supabase](https://supabase.com) project.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` (see [.env.example](.env.example)) and set your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

3. Set up the database. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql)
   to create the `profiles`, `snippets`, and `favorites` tables with Row Level Security.

4. Enable the **GitHub** auth provider in your Supabase dashboard
   (Authentication → Providers) and add `http://localhost:3000/auth/callback`
   as a redirect URL.

5. Run the app:
   ```bash
   npm run dev
   ```
