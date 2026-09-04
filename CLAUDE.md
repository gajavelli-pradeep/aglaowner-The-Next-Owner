@AGENTS.md

# Project: aglaowner — HTML → Next.js rebuild

Source HTML lives in `../requirements/` (sibling to this `app/` dir):
- `aglaowner-landing-page.html`
- `aglaowner-admin.html`
- `aglaowner-referral.html`

These are the visual source of truth. Map each to a route:
`aglaowner-landing-page.html` → `/`, `aglaowner-admin.html` → `/admin`, `aglaowner-referral.html` → `/referral` (adjust if the HTML implies otherwise, e.g. internal nav/links).

**Before writing any code for these pages/sections, load the full rebuild spec:**
`C:\Users\gloke\.claude\prompts\html-to-nextjs-rebuild.md`

That file is the operating contract for this conversion: pixel-accuracy priority order, no redesign, component-map discipline (sections/ui/data), Supabase-ready data-access layering, Tailwind-first styling, responsive/interaction preservation, and the section-by-section validation workflow. Read it in full and follow it — do not reconvert from memory/summary.

Stack already in place: Next.js App Router, TypeScript, Tailwind (see `package.json`, `postcss.config.mjs`). Use it as-is; don't re-scaffold.
