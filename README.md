# sapiens.yoga

Alexandre's yoga method: https://sapiens.yoga. Plain HTML and one stylesheet, no build step: the home page
(`index.html`), the online practice and its signup (`online/index.html`), the privacy page (`privacy/index.html`),
`site.css`, `breath.js` (the sun), fonts and photos. Work on this site is checked by looking at it in a browser; the
dashboard's checks (below) also load it.

## Publishing

GitHub Pages publishes the **gh-pages** branch of `alexmontagna/sapiensyoga` (custom domain in `CNAME`, HTTPS
enforced), about a minute after a push. `main` still holds an older, unrelated Vite/React site (`src/`, `dist/`,
`package.json`): don't work there. To undo a change, `git revert` it and push.

## Its visits are counted

Since 5 Oct 2026 each page loads the studio's counter, `<script src="https://bussola.company/admin/stats.js"
defer></script>`: no cookie, nothing kept on the visitor's device, the IP address shortened on arrival and forgotten,
details deleted within 48 hours, totals kept 25 months. **To see the numbers**, sign in at
https://bussola.company/admin/ (a link by email, Alexandre's address only) and pick *sapiens.yoga* (the address
`https://bussola.company/admin/?sito=sapiens.yoga` goes straight there; the browser tab says "Admin • Prod ‼️ •
Sapiens Yoga"). How the counting works, what the goals are and the checks:
`~/projects/bussola.company/20-platform/dashboard/README.md`, "A site on its own domain: sapiens.yoga".

- **Goals**: the online signup (the page announces it, once the signup function has answered "ok", with
  `document.dispatchEvent(new CustomEvent("bussola:goal", { detail: "signup" }))`), a tap on WhatsApp, on the email
  address, on Instagram. The payment links (Stripe) are not goals. A link that must count for nothing carries
  `data-goal=""` (the addresses on the privacy page do).
- **The notice is `privacy/index.html`** (English and Italian, linked from the footer of every page): who is
  responsible (Alexandre Montagna), what is counted, what the online signup keeps, and a switch, *Don't count my
  visits* / *Non contare le mie visite*, which sets `bussola-stats` to "off" in the browser's localStorage (the counter
  honours it, and Global Privacy Control and Do Not Track too). **If you change what a page sends or keeps, change that
  page and the dashboard together**, and say on it only what the code does.
- **Alexandre's own visits never count.** On a computer, signing in to the dashboard is enough. On a phone, the
  dashboard shows a link «Non contare questo telefono su sapiens.yoga» (under «Le tue visite»): it opens
  `https://sapiens.yoga/privacy/#non-contarmi`, which turns the switch on at once. Open it once on each phone.

## The signup

The form on `online/` posts name, email, the topics ticked, the browser's language and a label (`sapiens.yoga/online`)
to the Supabase function `yoga-signup`, whose code and table live in the Sapiens repository
(`~/projects/sapiens.bio/20260219-Sapiens-Clodex/supabase/functions/yoga-signup/index.ts`, `yoga_signups.sql`). The
privacy page describes exactly that: keep them in step.

## Checks

The dashboard's repository serves a copy of this site on `127.0.0.1:8789` and counts it locally
(`checks/yoga-server.mjs`): `node checks/run.mjs checks/yoga.mjs 390 844` there (also `1440 900`, `DARK=1`) tests the
counter on every page, the signup goal (the signup function is answered inside the page, nobody is written to the
list), the privacy switch by keyboard and the `#non-contarmi` address, axe and the 44 px targets.
