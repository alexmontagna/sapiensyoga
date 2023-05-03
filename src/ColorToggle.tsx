import { useState } from 'react'
import './ColorToggle.scss'

const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedThemePreference = localStorage.getItem('theme');
const initialTheme = storedThemePreference || (userPrefersDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', initialTheme);



// if (storedThemePreference) {
//     document.documentElement.setAttribute('data-theme', storedThemePreference);
// } else if (userPrefersDark) {
//     document.documentElement.setAttribute('data-theme', 'dark');
// }

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    // localStorage.setItem('theme', newTheme);
}


function ColorToggle() {
    return (
        <>
            <div className="color-toggle">
                <button className="toggle color-toggle__button">change</button>
            </div>
        </>
    )
}
export default ColorToggle