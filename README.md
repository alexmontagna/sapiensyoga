# sapiens.yoga

Alexandre's yoga method: https://sapiens.yoga. Plain HTML and one stylesheet, no build step. Work on this site is
checked by looking at it in a browser; the dashboard's checks (below) also load it.

## The pages, in two languages

Since 2 Nov 2026 every page is written in English and in Italian, and two pills at the top (*English*, *Italiano*)
lead to the same page in the other language; `hreflang` links name each page's twin. English comes first: it is the
home's language, as on the privacy page (Alexandre's choice, 23 Oct 2026). **A change to a page's words goes into its
twin in the same commit.**

| English | Italian | What it is |
|---|---|---|
| `/` (`index.html`) | `/it/` (`it/index.html`) | the home: the sun, the offer and two actions (WhatsApp, online groups), the method, the photo, who's behind it, the private classes with their Stripe links, sapiens.bio, the contacts |
| `/en/online/` (`en/online/index.html`) | `/online/` (`online/index.html`) | the online practice: what a class is like, the signup, the paused packages, the private classes |
| `/privacy/#english` | `/privacy/#italiano` | one page, two tabs: a tab writes its language in the address, so a copied link opens in it |

`404.html` is GitHub Pages' page for any address the site doesn't have, in the site's look, in both languages, with
the counter (the dashboard sees the mistyped address as a page). `signup.js` is the form of both online pages,
`breath.js` the sun (a tap makes it bounce, a second's hold makes it choke), `site.css` the one stylesheet.

- **Colours**: plain values, the light ones in `:root` and the dark ones in a `prefers-color-scheme: dark` media
  query. No `light-dark()` or `color-mix()`: Safari before 17.5 (iOS 16), Chrome before 123 and Firefox before 120 drop
  them and showed black on white with no sun. A mix is worked out once (oklab) and written as a colour; the dashboard's
  check fails if either function comes back.
- **Fonts**: `fonts/fraunces.woff2` has its SOFT axis pinned at 100, the only value the site uses (62 KB instead of
  121 KB; wght, opsz and WONK stay, WONK for the sun's shouts). To redo it from a fresh Fraunces:
  `fontTools.varLib.instancer.instantiateVariableFont(font, {"SOFT": 100})`, saved as woff2. Both fonts are preloaded.
- **Icons**: `favicon.svg` and `favicon.ico` (the tab), `apple-touch-icon.png` (an iPhone's home screen),
  `icon-192.png` and `icon-512.png` in `site.webmanifest` (Android): a full square, the corners rounded by the phone.
- **The paused online packages** are plain rows, not links, so no reader mode or copied link reaches a payment. Their
  Stripe links, for the restart: Singola €15 `https://buy.stripe.com/00g5lmba1ghR79S7st`, Abbonamento €50
  `https://buy.stripe.com/6oE9BCemd9Tt3XG4gi`, Illimitato €100 `https://buy.stripe.com/5kAbJKba12r165O4gj`.
- **The private classes** (€90, €290, €550) are on both homes and both online pages: four copies of the same three
  Stripe links. Under them, the right of withdrawal (Codice del Consumo, art. 52 and following: 14 days from paying,
  less the classes already done).

## Publishing

GitHub Pages publishes the **gh-pages** branch of `alexmontagna/sapiensyoga` (custom domain in `CNAME`, HTTPS
enforced), about a minute after a push. `main` still holds an older, unrelated Vite/React site: don't work there.
Its files (`src/`, `dist/`, `package.json`, `chatgpt.css`…) were also carried on gh-pages and so published, a page
(`/dist/`) with no counter among them; they were removed on 5 Oct 2026, because the privacy page says every page loads
the counter. Don't bring them back. To undo a change, `git revert` it and push.

### Each push is marked on the timeline

There is no deploy script here (GitHub Pages publishes on push), so a Git hook does what the deploy scripts of the other
counted sites do: the commits being pushed to **gh-pages** go on the timeline of the studio's dashboard
(bussola.company/admin, *sapiens.yoga*), each with its first seven digits and its first line. The hook is
`.git/hooks/pre-push`, which lives outside Git: a new clone must make it again. It never stops a push; if the mark can't
be written it says so on the screen and the push goes on.

```sh
#!/bin/sh
PIN="$HOME/projects/bussola.company/20-platform/dashboard/scripts/pin-push.sh"
if [ -f "$PIN" ]; then sh "$PIN" sapiens.yoga gh-pages "$@"; else echo "pin: $PIN not found, this push is not marked on the timeline" >&2; fi
exit 0
```

Save it as `.git/hooks/pre-push` and run `chmod +x .git/hooks/pre-push`. Pushing a commit twice marks it once.

## Its visits are counted

Since 5 Oct 2026 each page loads the studio's counter, `<script src="https://bussola.company/admin/stats.js"
defer></script>`: no cookie, nothing kept on the visitor's device, the IP address shortened on arrival and forgotten,
a fingerprint whose key is deleted at the end of its day, the visits' details and the totals kept 25 months (since
19 Oct 2026; details were deleted within 48 hours before). From the masked address the server reads the place (the
city abroad down to villages of about 500 people) and, since the evening of 19 Oct 2026, the operator of the
visitor's network («TIM», «Vodafone»), kept with the visit; the privacy page says both. **To see the numbers**, sign in at
https://bussola.company/admin/ (a link by email, Alexandre's address only) and pick *sapiens.yoga* (the address
`https://bussola.company/admin/?sito=sapiens.yoga` goes straight there; the browser tab says "Admin • Prod ‼️ •
Sapiens Yoga"). How the counting works, what the goals are and the checks:
`~/projects/bussola.company/20-platform/dashboard/README.md`, "A site on its own domain: sapiens.yoga".

- **Goals**: the online signup (the page announces it, once the signup function has answered "ok", with
  `document.dispatchEvent(new CustomEvent("bussola:goal", { detail: "signup" }))`; the function also answers "ok" to an
  address already on the list, a bot's filled trap and a day over its caps, so the goal can count more than the list
  has rows), a tap on WhatsApp, on the email address, on Instagram. The payment links (Stripe) are not goals. A link that must count for nothing carries
  `data-goal=""` (the addresses on the privacy page do).
- **The sun's presses** (since 22 Oct 2026, Alexandre's request): each time a finger or the mouse lets go of the sun,
  `breath.js` tells the counter how long it was held and whether the sun choked (`bussola:press`, held a second or
  more). Each page view keeps its presses, the long ones, the seconds held in all and in the longest press; the
  dashboard's card «Il sole» shows the seconds in all, the average per person who pressed it and each person, day by
  day, and «Visita per visita» shows them on each visit. The privacy page says so.
- **The notice is `privacy/index.html`** (English and Italian, linked from the footer of every page): who is
  responsible (Alexandre Montagna), what is counted, what the online signup keeps, and, below the text, a switch,
  *Don't count my visits* / *Non contare le mie visite*, which sets `bussola-stats` to "off" in the browser's localStorage (the counter
  honours it, and Global Privacy Control and Do Not Track too). **If you change what a page sends or keeps, change that
  page and the dashboard together**, and say on it only what the code does. It reads in one language at a time
  (Alexandre, 23 Oct 2026): two tabs under the title, *English* selected, *Italiano* swapping the text, the lead and the
  switch's words (the page's `lang` hides whatever carries the other one in `data-lang`); `/privacy/#italiano` opens it
  in Italian. Without JavaScript both languages show, one after the other.
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

The form on `online/` and `en/online/` (`signup.js`) posts name, email, the topics ticked, the browser's language and a
label, the form's `data-source` (`sapiens.yoga/online` from the Italian page, `sapiens.yoga/en/online` from the English one)
to the Supabase function `yoga-signup`, whose code and table live in the Sapiens repository
(`~/projects/sapiens.bio/20260219-Sapiens-Clodex/supabase/functions/yoga-signup/index.ts`, `yoga_signups.sql`). The
privacy page describes exactly that: keep them in step.

## Checks

The dashboard's repository serves a copy of this site on `127.0.0.1:8789` and counts it locally
(`checks/yoga-server.mjs`): `node checks/run.mjs checks/yoga.mjs 390 844` there (also `1440 900`, `DARK=1`) tests the
counter on every page, the signup goal (the signup function is answered inside the page, nobody is written to the
list), the privacy switch by keyboard and the `#non-contarmi` address, axe and the 44 px targets; since 2 Nov 2026
also each page's twin in the other language, the English form's label, a mistake shown under its own field, the 404
page (served as GitHub Pages does, and counted) and a stylesheet free of `light-dark()` and `color-mix()`.
