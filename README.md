# sapiens.yoga

Alexandre's yoga method: https://sapiens.yoga. Plain HTML and one stylesheet, no build step: the home page
(`index.html`), the online practice and its signup (`online/index.html`), the privacy page (`privacy/index.html`),
`site.css`, `breath.js` (the sun), fonts and photos. Work on this site is checked by looking at it in a browser; the
dashboard's checks (below) also load it.

## Publishing

GitHub Pages publishes the **gh-pages** branch of `alexmontagna/sapiensyoga` (custom domain in `CNAME`, HTTPS
enforced), about a minute after a push. `main` still holds an older, unrelated Vite/React site: don't work there.
Its files (`src/`, `dist/`, `package.json`, `chatgpt.css`…) were also carried on gh-pages and so published, a page
(`/dist/`) with no counter among them; they were removed on 5 Oct 2026, because the privacy page says every page loads
the counter. Don't bring them back. To undo a change, `git revert` it and push.

## Its visits are counted

Since 5 Oct 2026 each page loads the studio's counter, `<script src="https://bussola.company/admin/stats.js"
defer></script>`: no cookie, nothing kept on the visitor's device, the IP address shortened on arrival and forgotten,
details deleted within 48 hours, totals kept 25 months. **To see the numbers**, sign in at
https://bussola.company/admin/ (a link by email, Alexandre's address only) and pick *sapiens.yoga* (the address
`https://bussola.company/admin/?sito=sapiens.yoga` goes straight there; the browser tab says "Admin • Prod ‼️ •
Sapiens Yoga"). How the counting works, what the goals are and the checks:
`~/projects/bussola.company/20-platform/dashboard/README.md`, "A site on its own domain: sapiens.yoga".

- **Goals**: the online signup (the page announces it, once the signup function has answered "ok", with
  `document.dispatchEvent(new CustomEvent("bussola:goal", { detail: "signup" }))`; the function also answers "ok" to an
  address already on the list, a bot's filled trap and a day over its caps, so the goal can count more than the list
  has rows), a tap on WhatsApp, on the email address, on Instagram. The payment links (Stripe) are not goals. A link that must count for nothing carries
  `data-goal=""` (the addresses on the privacy page do).
- **The notice is `privacy/index.html`** (English and Italian, linked from the footer of every page): who is
  responsible (Alexandre Montagna), what is counted, what the online signup keeps, and a switch, *Don't count my
  visits* / *Non contare le mie visite*, which sets `bussola-stats` to "off" in the browser's localStorage (the counter
  honours it, and Global Privacy Control and Do Not Track too). **If you change what a page sends or keeps, change that
  page and the dashboard together**, and say on it only what the code does.
- **Alexandre's own visits never count**, but this site is on another address than the dashboard, so the dashboard's
  mark can't reach its visitors' browsers. In each browser Alexandre uses, **open the link the dashboard shows under
  «Le tue visite»** («Non contare questo telefono su sapiens.yoga» on a phone, «Non contare questo browser su
  sapiens.yoga» on a computer or tablet): it opens `https://sapiens.yoga/privacy/#non-contarmi`, which turns the switch
  on at once. Two limits, the browsers' own: Safari erases what a script saved after 7 days of use without a visit to
  the site, and an app's own browser (Instagram, Gmail) has a storage of its own: open the link again there. A second
  net, for computers only: each time the dashboard is open the server notes that computer's fingerprint of the day
  (same browser, same network) and drops its visits to every site that day, but not on a day the dashboard stays
  closed.

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
