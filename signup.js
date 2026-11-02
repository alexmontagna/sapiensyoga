// The signup for the online practice, on /online/ (Italian) and /en/online/ (English): it posts the name, the email,
// the topics ticked, the browser's language and the form's label (data-source on the form) to the Supabase function
// yoga-signup, as the privacy page says. Each mistake is told under its own field, tied to it by aria-describedby,
// so a phone with the keyboard open shows it next to the field that gets the focus.
(() => {
    const form = document.querySelector(".signup");
    if (!form) return;
    const endpoint = "https://mcypxeahobnztcapbrds.supabase.co/functions/v1/yoga-signup";
    // Sapiens' public anon key: it opens this function and nothing else.
    const anonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeXB4ZWFob2JuenRjYXBicmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTYwNjAsImV4cCI6MjA5ODM5MjA2MH0.wMaOgb0iEh-TsRBfobXiWXmGjPMPHcpf0_3MiUxaKuA";
    const TEXT = document.documentElement.lang.startsWith("it")
        ? {
              fallback: "L'iscrizione non è passata. Riprova tra qualche minuto, oppure scrivimi ad alex@sapiens.bio.",
              wait: "Un attimo…",
              name: "Scrivi il tuo nome.",
              email: "Questa email sembra incompleta: controllala.",
              thanks: (name) => `Grazie, ${name}!`,
              done: "Sei nella lista. A presto!",
          }
        : {
              fallback: "The signup didn't go through. Try again in a few minutes, or write to me at alex@sapiens.bio.",
              wait: "One moment…",
              name: "Write your name.",
              email: "This email looks incomplete: check it.",
              thanks: (name) => `Thank you, ${name}!`,
              done: "You're on the list. See you soon!",
          };
    const status = form.querySelector(".signup__status");
    const button = form.querySelector("button[type=submit]");

    const say = (text, tone = "") => {
        status.textContent = text;
        status.dataset.tone = tone;
    };

    // a field's message: under the field, the field marked invalid, the focus on it
    const flag = (input, text) => {
        const note = document.getElementById(`${input.id}-error`);
        if (note) note.textContent = text;
        input.setAttribute("aria-invalid", "true");
        say("");
        input.focus();
    };
    const clear = (input) => {
        const note = document.getElementById(`${input.id}-error`);
        if (note) note.textContent = "";
        input.removeAttribute("aria-invalid");
    };
    for (const input of [form.FNAME, form.EMAIL]) input.addEventListener("input", () => input.hasAttribute("aria-invalid") && clear(input));

    const welcome = (name) => {
        const done = document.createElement("div");
        done.className = "signup__done";
        done.tabIndex = -1;
        done.setAttribute("role", "status");
        const title = document.createElement("strong");
        title.textContent = TEXT.thanks(name);
        const text = document.createElement("p");
        text.textContent = TEXT.done;
        done.append(title, text);
        form.replaceWith(done);
        done.focus();
    };

    const wrongName = () => flag(form.FNAME, TEXT.name);
    const wrongEmail = () => flag(form.EMAIL, TEXT.email);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = form.FNAME.value.trim();
        const email = form.EMAIL.value.trim();
        clear(form.FNAME);
        clear(form.EMAIL);
        if (!name) return wrongName();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return wrongEmail();

        button.disabled = true;
        form.setAttribute("aria-busy", "true");
        say(TEXT.wait);
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonKey}`, apikey: anonKey },
                body: JSON.stringify({
                    name,
                    email,
                    interests: [...form.querySelectorAll("[name=interests]:checked")].map((input) => input.value),
                    website: form.website.value,
                    locale: navigator.language || null,
                    source: form.dataset.source || "sapiens.yoga/online",
                }),
                // Safari before 16 has no AbortSignal.timeout: there the request simply waits, rather than failing every time
                signal: typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(15000) : undefined,
            });
            const reply = await response.json().catch(() => ({}));
            if (response.ok && reply.ok) {
                // The counter (bussola.company/admin/stats.js) counts the signup as a goal: only that it happened.
                document.dispatchEvent(new CustomEvent("bussola:goal", { detail: "signup" }));
                return welcome(name);
            }
            if (reply.error === "name") return wrongName();
            if (reply.error === "email") return wrongEmail();
            say(TEXT.fallback, "error");
        } catch {
            say(TEXT.fallback, "error");
        } finally {
            button.disabled = false;
            form.removeAttribute("aria-busy");
        }
    });
})();
