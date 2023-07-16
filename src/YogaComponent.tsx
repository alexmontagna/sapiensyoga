import { useState } from 'react'
import './YogaComponent.scss'

function YogaComponent() {
    const [count, setCount] = useState(0)
    return (
        <>
            <main>
                <header>
                    <h1>sapiens.yoga</h1>
                    <span>simple techniques for humans</span>
                </header>
                <section data-section="what's sapiens yoga all about?">
                    <h2>
                        what's sapiens yoga all about?
                    </h2>
                    <p>
                        it's a fresh take on ancient yoga adapted for post-pandemic AI-blooming humankind.
                    </p>
                </section>
                <section data-section="why choose sapiens yoga?">
                    <h2>
                        why choose sapiens yoga?
                    </h2>
                    <p>
                        because it's good.
                    </p>
                    <p>
                        and because it's simple.
                    </p>
                    <p>
                        humans learned so much over thousands of years. sapiens yoga combines the best of the past in a sanskrit-less
                        fashion. it's high time for a label that offers the rich history of yoga while embracing all the amazing knowledge we've
                        gained in the last centuries.
                    </p>
                </section>
                <section data-section="what's the method like?">
                    <h2>
                        what's the method like
                    </h2>
                    <p>
                        focused on free body exercises and simple breathing techniques, the method aims to enhance your emotions and
                        thoughts through enjoyable mindfulness and relaxation moments. it also seeks to improve wellbeing by promoting a
                        healthy, flexible, and strong body, ultimately leading to organic happiness.
                    </p>
                </section>
                <section data-section="how can i give it a try?">
                    <h2>
                        how can i give it a try?
                    </h2>
                    <p>
                        for now, you can experience sapiens yoga through private classes in milan, retreats in italy or online groups.
                    </p>
                </section>
                <section data-section="who's behind sapiens yoga?">
                    <h2>
                        who's behind sapiens yoga?!
                    </h2>
                    <p>
                        Me.
                    </p>
                    <iframe
                        style={{width: "560px", height: "315px", display: "none"}}
                        src="https://www.youtube.com/embed/lSvKNNtkUSU"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    >
                    </iframe>
                </section>
            </main>
        </>
    )
}
export default YogaComponent