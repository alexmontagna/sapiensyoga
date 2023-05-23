import { useState } from 'react'
import './YogaComponent.scss'

function YogaComponent() {
    const [count, setCount] = useState(0)
    return (
        <>
            <main>
                <header>
                    <h1>sapiens.yoga</h1>
                    <span>simple wellness for our species</span>
                </header>
                <section>
                    <h2>
                        what's sapiens yoga all about?
                    </h2>
                    <p>
                        sapiens yoga is a fresh take on ancient traditions, adapted for our modern lives.
                    </p>
                </section>
                <section>
                    <h2>
                        why choose sapiens yoga?
                    </h2>
                    <p>
                        this project is here to inspire those seeking self-development in a contemporary way.
                    </p>
                    <p>
                        we've learned so much over thousands of years. sapiens yoga combines the best of the past in a sanskrit-less
                        fashion.
                    </p>
                    <p>
                        it's high time for a label that offers the rich history of yoga while embracing all the amazing knowledge we've
                        gained in recent centuries.
                    </p>
                </section>
                <section>
                    <h2>
                        what's the method like
                    </h2>
                    <p>
                        focused on free body exercises and simple breathing techniques, the method aims to enhance your emotions and
                        thoughts through enjoyable mindfulness and relaxation moments. it also seeks to improve wellbeing by promoting a
                        healthy, flexible, and strong body, ultimately leading to organic happiness.
                    </p>
                </section>
                <section>
                    <h2>
                        how can i give it a try?
                    </h2>
                    <p>
                        for now, you can experience sapiens yoga through private classes in milan, retreats in italy, or online groups.
                    </p>
                </section>
                <section>
                    <h2>
                        who's behind sapiens yoga's master mind?
                    </h2>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/lSvKNNtkUSU" title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </section>
            </main>
        </>
    )
}
export default YogaComponent