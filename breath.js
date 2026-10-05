// The breathing sun, on both pages. Press and hold it for a second and it chokes: it coughs and gasps words out into
// space while it struggles under the finger. Let go and it comes back, composes itself and breathes again.
(() => {
    const breath = document.querySelector(".breath");
    const sun = breath && breath.querySelector(".breath__sun");
    if (!sun || !window.PointerEvent || !sun.animate || !CSS.supports("translate", "1px 1px")) return;

    const WORDS = document.documentElement.lang.startsWith("it")
        ? {
              soft: ["cof", "coff", "cof cof", "khh", "ehk"],
              loud: ["COFF!", "COFF COFF!", "KOFF!", "ECK!", "KAH!", "ARGH!", "UGH!"],
              gasp: ["anf!", "anf anf", "ANF!", "gasp!", "aria!", "ARIA!"],
              plea: ["mollami!", "aiuto!", "pietà!"],
              weak: ["coff…", "anf…", "hhh…", "…aria…", "uff…"],
              ahem: "ehm.",
              serene: "torniamo alla serenità",
          }
        : {
              soft: ["kof", "kof kof", "khh", "cough", "hck"],
              loud: ["KOFF!", "COUGH!", "HACK!", "KAFF!", "HRRK!", "KOF KOF!", "ACK!"],
              gasp: ["gasp!", "*gasp*", "hhhaaa", "air!", "AIR!", "wheeze"],
              plea: ["let go!", "too tight!", "mercy!"],
              weak: ["kof…", "hhh…", "…air…", "wheeze…", "ugh…"],
              ahem: "ahem.",
              serene: "back to serenity",
          };
    const [cueIn, cueOut] = [...breath.querySelectorAll(".breath__cue span")].map((span) => span.textContent);
    // font size of each kind of word, as a share of the sun's width
    const SIZE = { soft: 0.09, loud: 0.12, gasp: 0.085, weak: 0.075, plea: 0.13, ahem: 0.075 };

    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const clamp = (n) => Math.min(1, Math.max(0, n));
    const any = () => Math.random() * 2 - 1;
    const ease = (p) => p * p * (3 - 2 * p);
    const lastPick = new Map();
    const pick = (list) => {
        let word;
        do word = list[Math.floor(Math.random() * list.length)];
        while (word === lastPick.get(list) && list.length > 1);
        lastPick.set(list, word);
        return word;
    };

    // the sun's body as springs that overshoot: squeeze (s), squash (q), sideways (x), up and down (y), tilt (r)
    const spring = (k, c) => ({ v: 0, w: 0, t: 0, k, c });
    const body = { s: spring(260, 9), q: spring(320, 10), x: spring(150, 7), y: spring(150, 7), r: spring(150, 7) };
    const springs = Object.values(body);
    const jitter = { x: 0, y: 0, r: 0 };
    const speech = new Set();

    let phase = "idle"; // idle, press (the first second), fit (coughing), calm (composing itself)
    let resumeTo = "idle";
    let pointer = null;
    let touch = false;
    let pressT = 0;
    let fitT = 0;
    let calmT = 0;
    let calmStep = 0;
    let loops = []; // the CSS breathing loops of the sun and its cues
    let frozen = []; // what the press paused, to play on a short press
    let held = 1; // the sun's CSS scale where the press froze it
    let base = 1;
    let baseFrom = 1;
    let baseTo = 1;
    let amp = 1; // 0 when the visitor asks for reduced motion: the sun only blushes and the words don't fly
    let size = 0;
    let shake = 0;
    let flush = 0;
    let pale = 0;
    let blob = 0;
    let wobble = 0;
    let script = null;
    let nextAt = 0;
    let aim = Math.random() * 6.3;
    let pleaT = -9;
    let layer = null;
    let raf = 0;
    let then = 0;

    const rage = () => clamp(fitT / 3);
    const tired = () => clamp((fitT - 8) / 3);
    const push = (p, dv) => (p.w += dv * amp);
    const nextAim = () => (aim += 2.4 + any() * 0.45);
    const buzz = (ms) => touch && navigator.vibrate && navigator.userActivation?.hasBeenActive && navigator.vibrate(ms);

    // where the sun is now, in page coordinates, and how big it is drawn
    const origin = () => {
        const box = breath.getBoundingClientRect();
        return {
            x: box.left + box.width / 2 + scrollX + (body.x.v + jitter.x) * size * held,
            y: box.top + box.height / 2 + scrollY + (body.y.v + jitter.y) * size * held,
            k: held * base,
        };
    };

    // a word shouted from the sun's rim, flying out and fading into space; returns the way it went
    const shout = (text, kind, angle, loudness) => {
        if (layer.childElementCount > 40) return angle;
        const word = document.createElement("span");
        word.className = `shout is-${kind}`;
        word.textContent = text;
        word.style.fontSize = `${(SIZE[kind] * size * (0.8 + 0.35 * loudness)).toFixed(1)}px`;
        layer.append(word);
        const range = document.createRange();
        range.selectNodeContents(word);
        const box = range.getBoundingClientRect();
        const { x, y, k } = origin();
        const quiet = kind === "ahem" || kind === "weak";
        // without motion the words just appear around the sun and fade
        const from = size * (amp ? 0.3 : 0.56) * k;
        const wish = amp * size * (quiet ? 0.25 + 0.12 * Math.random() : (0.5 + 0.35 * Math.random()) * (0.7 + 0.45 * loudness));
        // how far the word can fly that way and still be whole on the screen (a phone has little room on the sides)
        const right = document.documentElement.clientWidth;
        const bottom = Math.min(innerHeight, layer.offsetHeight - scrollY);
        const halfW = box.width * 0.58 + 6;
        const halfH = box.height * 0.58 + 6;
        const room = (a) => {
            const cos = Math.cos(a);
            const sin = Math.sin(a);
            const sx = x - scrollX + cos * from;
            const sy = y - scrollY + sin * from;
            let t = Infinity;
            if (cos > 0.01) t = Math.min(t, (right - halfW - sx) / cos);
            if (cos < -0.01) t = Math.min(t, (sx - halfW) / -cos);
            if (sin > 0.01) t = Math.min(t, (bottom - halfH - sy) / sin);
            if (sin < -0.01) t = Math.min(t, (sy - halfH) / -sin);
            return t;
        };
        let best = room(angle);
        for (let i = 1, a = angle; i < 6 && best < (quiet ? 0 : wish * 0.6); i++) {
            a += 2.4 + any() * 0.3;
            const r = room(a);
            if (r > best) [angle, best] = [a, r];
        }
        aim = angle;
        const reach = Math.max(0, Math.min(wish, best));
        const tilt = any() * (quiet ? 6 : 18);
        const turn = amp * any() * 14;
        const time = (quiet ? 1700 : 1150 + 450 * Math.random()) + 350 * loudness;
        const at = (d) => `${(x + Math.cos(angle) * d).toFixed(1)}px ${(y + Math.sin(angle) * d).toFixed(1)}px`;
        word.animate({ translate: [at(from), at(from + reach)], rotate: [`${tilt}deg`, `${tilt + turn}deg`] }, { duration: time, easing: "cubic-bezier(0.12, 0.75, 0.25, 1)" });
        const grow = !amp ? [1, 1, 1] : quiet ? [0.85, 1, 0.9] : [0.3, 1.14, 0.7];
        word.animate(
            [
                { scale: grow[0], opacity: 0, filter: "blur(0px)" },
                { scale: grow[1], opacity: 1, filter: "blur(0px)", offset: quiet ? 0.25 : 0.08 },
                { opacity: 1, filter: "blur(0px)", offset: 0.45 },
                { scale: grow[2], opacity: 0, filter: "blur(2.5px)" },
            ],
            time
        ).finished.then(() => word.remove(), () => word.remove());
        return angle;
    };

    // embers coughed out with the word
    const sparks = (angle, count) => {
        if (!amp) return;
        const { x, y, k } = origin();
        for (let i = 0; i < count; i++) {
            const spark = document.createElement("i");
            const d = 3 + 4 * Math.random();
            spark.className = "spark";
            spark.style.width = spark.style.height = `${d.toFixed(1)}px`;
            spark.style.margin = `${(-d / 2).toFixed(1)}px`;
            layer.append(spark);
            const a = angle + any() * 0.7;
            const from = size * 0.36 * k;
            const to = from + size * (0.12 + 0.35 * Math.random());
            const at = (r) => `${(x + Math.cos(a) * r).toFixed(1)}px ${(y + Math.sin(a) * r).toFixed(1)}px`;
            spark
                .animate({ translate: [at(from), at(to)], opacity: [1, 0], scale: [1, 0.3] }, { duration: 450 + 450 * Math.random(), easing: "cubic-bezier(0.1, 0.7, 0.3, 1)" })
                .finished.then(() => spark.remove(), () => spark.remove());
        }
    };

    const cough = (loudness) => {
        push(body.s, -2.6 * loudness);
        push(body.q, 2.8 * loudness);
        push(body.y, 0.55 * loudness);
        push(body.x, any() * 0.9 * loudness);
        push(body.r, any() * 110 * loudness);
        const kind = tired() > 0.5 ? "weak" : loudness > 0.85 ? "loud" : "soft";
        const angle = shout(pick(WORDS[kind]), kind, nextAim(), loudness);
        if (kind !== "weak") sparks(angle, Math.round(1 + 3.5 * loudness));
        buzz(16 + 30 * loudness);
    };

    const gasp = (loudness) => {
        push(body.s, 2.1 * loudness);
        push(body.q, -2.5 * loudness);
        push(body.y, -0.5 * loudness);
        shout(pick(WORDS[tired() > 0.5 ? "weak" : "gasp"]), "gasp", nextAim(), loudness);
    };

    const lurch = (strength) => {
        push(body.x, any() * (1.6 + Math.random()) * strength);
        push(body.y, any() * 0.9 * strength);
        push(body.r, any() * 190 * strength);
        push(body.q, any() * 1.2 * strength);
    };

    // it staggers about under the finger
    const wander = (strength) => {
        body.x.t = any() * 0.1 * strength * amp;
        body.y.t = any() * 0.06 * strength * amp;
        body.r.t = any() * 10 * strength * amp;
    };

    // the fit, as it grows: a few coughs, then rage (after 3 s), then exhaustion (after 8 s); yields the pause to the next step
    function* coughing() {
        cough(0.7);
        yield 420;
        for (;;) {
            const r = rage();
            const t = tired();
            if (t) body.x.t = body.r.t = 0;
            else wander(r);
            if (Math.random() < 0.45 * r * (1 - t)) {
                lurch(r);
                yield 160;
            }
            const coughs = 1 + Math.floor(Math.random() * (1.6 + 2.6 * r * (1 - t)));
            for (let i = 0; i < coughs; i++) {
                cough((0.55 + 0.6 * r) * (1 - 0.45 * t) * (0.85 + 0.3 * Math.random()));
                yield 140 + 110 * Math.random() + 260 * t;
            }
            yield 180 + 220 * Math.random();
            if (Math.random() < 0.5 + 0.4 * r) {
                gasp((0.6 + 0.5 * r) * (1 - 0.4 * t));
                yield 380 + 220 * Math.random() + 300 * t;
            }
            if (r === 1 && !t && fitT - pleaT > 3.2 && Math.random() < 0.45) {
                pleaT = fitT;
                lurch(1);
                shout(pick(WORDS.plea), "plea", nextAim(), 1.15);
                buzz(60);
                yield 560;
            }
            yield (420 + 420 * Math.random()) * (1 - 0.4 * r) + 900 * t;
        }
    }

    // a line the sun says calmly in its middle, where the cues live; its three dots come one by one
    const say = (text, delay, fadeIn, hold, fadeOut, gap) => {
        const line = document.createElement("p");
        line.className = "breath__say";
        line.append(text);
        const total = fadeIn + hold + fadeOut;
        const shown = line.animate(
            [
                { opacity: 0, easing: "ease" },
                { opacity: 0.85, offset: fadeIn / total },
                { opacity: 0.85, offset: (fadeIn + hold) / total, easing: "ease" },
                { opacity: 0 },
            ],
            { duration: total, delay }
        );
        const parts = [shown];
        for (let i = 1; i <= 3; i++) {
            const dot = document.createElement("span");
            dot.textContent = ".";
            line.append(dot);
            parts.push(dot.animate({ opacity: [0, 1] }, { duration: 400, delay: delay + fadeIn * 0.6 + gap * i, fill: "both" }));
        }
        breath.append(line);
        parts.forEach((part) => speech.add(part));
        shown.finished.then(
            () => {
                line.remove();
                parts.forEach((part) => speech.delete(part));
            },
            () => {}
        );
        return shown;
    };

    const hush = () => {
        speech.forEach((part) => part.cancel());
        speech.clear();
        breath.querySelectorAll(".breath__say").forEach((line) => line.remove());
    };

    const startFit = (now) => {
        phase = "fit";
        fitT = 0;
        hush();
        breath.classList.add("is-shaken");
        script = coughing();
        nextAt = now;
    };

    // let go: it comes back, settles where the breathing loop starts (fully exhaled) and composes itself
    const recover = () => {
        phase = "calm";
        calmT = 0;
        calmStep = 0;
        springs.forEach((p) => (p.t = 0));
        const loop = loops.find((anim) => anim.animationName === "breathe");
        const exhaled = loop ? parseFloat(loop.effect.getKeyframes()[0].scale) || 0.78 : held;
        baseFrom = base;
        baseTo = exhaled / held;
    };

    // back to the loop, from its start: "breathe in…", "breathe out…", then the usual cues again
    const restart = () => {
        phase = "idle";
        base = baseFrom = baseTo = 1;
        springs.forEach((p) => (p.v = p.w = p.t = 0));
        jitter.x = jitter.y = jitter.r = 0;
        flush = pale = shake = blob = 0;
        loops.forEach((loop) => {
            loop.currentTime = 0;
            loop.play();
        });
        // the same timing as the cue-in and cue-out keyframes in site.css
        say(cueIn, 0, 600, 2500, 600, 450);
        say(cueOut, 4000, 700, 4100, 900, 900).finished.then(() => breath.classList.remove("is-shaken"), () => {});
    };

    const render = () => {
        if (amp) {
            const s = base * (1 + body.s.v);
            const q = body.q.v;
            const x = (body.x.v + jitter.x) * size;
            const y = (body.y.v + jitter.y) * size;
            const r = body.r.v + jitter.r;
            sun.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${r.toFixed(2)}deg) scale(${(s * (1 + 0.7 * q)).toFixed(4)}, ${(s * (1 - q)).toFixed(4)})`;
            // a jelly outline: each corner's radius wobbles around 50%, opposite corners in step
            const b = Math.min(1, blob + Math.abs(q) * 2.5) * 7;
            const h1 = Math.sin(wobble * 1.3) * b;
            const h2 = Math.sin(wobble * 1.7 + 1.1) * b;
            const v1 = Math.sin(wobble * 1.1 + 2.3) * b;
            const v2 = Math.sin(wobble * 2.1 + 3.7) * b;
            const pc = (n) => `${(50 + n).toFixed(2)}%`;
            sun.style.borderRadius = `${pc(h1)} ${pc(-h1)} ${pc(h2)} ${pc(-h2)} / ${pc(v1)} ${pc(v2)} ${pc(-v2)} ${pc(-v1)}`;
        }
        // red in the face, then a little purple once it runs out of breath
        sun.style.filter =
            flush > 0.004 ? `hue-rotate(${(-24 * flush - 22 * pale).toFixed(1)}deg) saturate(${(1 + 0.45 * flush - 0.35 * pale).toFixed(3)}) brightness(${(1 - 0.08 * pale).toFixed(3)})` : "";
    };

    const tick = (now) => {
        const dt = Math.max(0, Math.min(0.05, (now - then) / 1000));
        then = now;
        let shakeTo = 0;
        let flushTo = 0;
        let blobTo = 0;
        if (phase === "press") {
            pressT += dt;
            body.s.t = pressT > 0.15 ? -0.05 * amp : 0;
            shakeTo = 0.35 * clamp((pressT - 0.45) / 0.55);
            flushTo = 0.15 * clamp((pressT - 0.3) / 0.7);
            blobTo = 0.2 * clamp((pressT - 0.45) / 0.55);
            if (pressT >= 1) startFit(now);
        }
        if (phase === "fit") {
            fitT += dt;
            const r = rage();
            const t = tired();
            shakeTo = (0.45 + 0.55 * r) * (1 - 0.5 * t);
            flushTo = 0.35 + 0.65 * r;
            blobTo = (0.4 + 0.6 * r) * (1 - 0.4 * t);
            if (t) {
                body.s.t = -0.07 * t * amp;
                body.y.t = 0.04 * t * amp;
            }
            if (now >= nextAt) nextAt = now + script.next().value;
        }
        if (phase === "calm") {
            calmT += dt;
            base = baseFrom + (baseTo - baseFrom) * ease(clamp(calmT / 1.4));
            if (calmStep === 0 && calmT >= 0.35) {
                calmStep = 1;
                // it straightens up and clears its throat
                push(body.q, -1.6);
                push(body.y, -0.3);
                shout(WORDS.ahem, "ahem", -Math.PI / 2 + any() * 0.35, 0.8);
            }
            if (calmStep === 1 && calmT >= 1.25) {
                calmStep = 2;
                say(WORDS.serene, 0, 700, 2300, 700, 500);
            }
            if (calmStep === 2 && calmT >= 4.95) restart();
        }
        const follow = (from, to, rate) => from + (to - from) * Math.min(1, dt * rate);
        shake = follow(shake, shakeTo, 8);
        flush = follow(flush, flushTo, flushTo > flush ? 3 : 1.5);
        pale = follow(pale, phase === "fit" ? tired() : 0, 1.5);
        blob = follow(blob, blobTo, 4);
        wobble += dt * (2.5 + 7 * shake);
        for (const p of springs) {
            p.w += (-p.k * (p.v - p.t) - p.c * p.w) * dt;
            p.v += p.w * dt;
        }
        // a tremble on top: noise that fades in about 55 ms
        const keep = Math.exp(-dt * 18);
        const kick = Math.sqrt(1 - keep * keep) * shake * amp;
        jitter.x = jitter.x * keep + any() * kick * 0.022;
        jitter.y = jitter.y * keep + any() * kick * 0.022;
        jitter.r = jitter.r * keep + any() * kick * 3.5;
        render();
        const resting = phase === "idle" && base === 1 && shake < 0.002 && flush < 0.004 && blob < 0.004 && springs.every((p) => Math.abs(p.v) < 0.0005 && Math.abs(p.w) < 0.005);
        if (resting) {
            raf = 0;
            jitter.x = jitter.y = jitter.r = 0;
            sun.style.transform = sun.style.borderRadius = sun.style.filter = "";
            return;
        }
        raf = requestAnimationFrame(tick);
    };

    const wake = () => {
        if (raf) return;
        then = performance.now();
        raf = requestAnimationFrame(tick);
    };

    const release = () => {
        if (pointer === null) return;
        pointer = null;
        body.s.t = 0;
        if (phase === "fit") return recover();
        // a short press: carry on where it was
        phase = resumeTo;
        frozen.forEach((anim) => anim.play());
    };

    sun.addEventListener("pointerdown", (event) => {
        if (pointer !== null || event.button !== 0) return;
        pointer = event.pointerId;
        touch = event.pointerType !== "mouse";
        try {
            sun.setPointerCapture(pointer);
        } catch {}
        resumeTo = phase === "calm" ? "calm" : "idle";
        amp = still.matches ? 0 : 1;
        size = sun.offsetWidth;
        // the sun holds its breath: the loops and whatever it was saying stop where they are
        loops = breath.getAnimations({ subtree: true }).filter((anim) => anim.animationName);
        frozen = [...loops, ...speech].filter((anim) => anim.playState === "running");
        frozen.forEach((anim) => anim.pause());
        held = parseFloat(getComputedStyle(sun).scale) || 1;
        // the space the words fly into, made during the first press so the first cough doesn't wait for it
        if (!layer) {
            layer = document.createElement("div");
            layer.className = "shouts";
            layer.setAttribute("aria-hidden", "true");
            document.body.append(layer);
        }
        phase = "press";
        pressT = 0;
        wake();
    });
    const end = (event) => event.pointerId === pointer && release();
    sun.addEventListener("pointerup", end);
    sun.addEventListener("pointercancel", end);
    sun.addEventListener("lostpointercapture", end);
    addEventListener("blur", release);
    document.addEventListener("visibilitychange", () => document.hidden && release());
    // once it coughs, the finger holds it: no scrolling, and no long-press menu on Android
    sun.addEventListener("touchmove", (event) => phase === "fit" && event.cancelable && event.preventDefault(), { passive: false });
    sun.addEventListener("contextmenu", (event) => pointer !== null && touch && event.preventDefault());
})();
