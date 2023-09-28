import emotionalIntelligence from './assets/softSkills.svg'
import empathy from './assets/softSkills.svg'
import changeEnthusiast from './assets/softSkills.svg'

import html from './assets/hardSkills.svg'
import css from './assets/hardSkills.svg'
import javascript from './assets/hardSkills.svg'
import react from './assets/hardSkills.svg'

function CoverLetter() {
    return (
        <main className="coverletter" lang='en'>
            <time dateTime="2023-05-10">May 10th, 2023</time>
            <h1>Cover letter for 'bwise Media AG'</h1>
            <p>Dear Sir or Madam of <strong>bwise Media AG</strong>,</p>
            <p>With this letter I would like to express my interest in working for your company as a Frontend Developer.</p>
            <p>My name is <strong>Alex Montagna</strong>, I'm 38 years old and I am a dual-citizen programmer living in Europe.</p>
            <p>I speak <span lang='en'>English</span>, <span lang="it">Italiano</span>, <span lang="pt">Português</span> and <span lang='fr'>un peu de Français</span></p>
            <p>After working for good companies for a specific projets, I'm now focusing on finding a stable contract to keep building my career and developing myself.</p>
            <p>I'm a {changeEnthusiast} that likes to live with {empathy} and tries to have the best performance on the matter of {emotionalIntelligence}.</p>
            <p>{html}, {css} and {javascript} are in my life since 2001, when I was super young building websites for fun.</p>
            <p>Back then, it wouldn't be easy to imagine the future of frontend with powerful instrument like {react} nowadays.</p>
            <p>I did a long pause in my frontend career to dedicate myself to <span lang="sa" title="Yoga">योग</span> philosophy. It was an <em>amazing journey!</em></p>
            <p>After that, I decided to come back to web development and it has been a decision that brought me much joy and intelectual fulfillment.</p>
            <p>Now, I'm looking for a company that I can grow with, and I believe that <strong>bwise Media AG</strong> is the right place for me.</p>
            <p>Even more because of the fact that I love Naples!</p>
            <p>I am looking forward to your reply.</p>
            <p>Yours sincerely,</p>
            <p>Alex Montagna</p>
            address: <address>Via Carlo Goldoni 3, Milan 20129, Italy</address>
            telephone: <a href="tel:+393889081340">+39 388 908 1340</a>
            email: <a href="mailto:alexandremontagna@gmail.com">alexandremontagna@gmail.com</a>
        </main>
    )
}
export default CoverLetter




