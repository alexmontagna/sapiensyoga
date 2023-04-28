import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './YogaComponent.scss'

function YogaComponent() {
    const [count, setCount] = useState(0)
    return (
        <>
            <header className="bg-rose-500 shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <h1 className="text-2xl font-bold text-white">Sapiens.Yoga Classes</h1>
                </div>
            </header>
            <main className="flex-grow container mx-auto flex flex-col justify-center items-center">
                <h2 className="text-3xl font-bold text-rose-900 mb-4">Our Yoga Classes Will Be Back Soon</h2>
                <p className="text-rose-800 text-lg mb-4">We are currently working on improving our classes to provide you with the best experience possible. Thank you for your patience!</p>
                <a href="#" className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded">Notify Me</a>
            </main>
            <footer className="bg-rose-300 py-4">
                <div className="container mx-auto text-center text-rose-800">
                    &copy; 2023 Sapiens.Yoga. All rights reserved.
                </div>
            </footer>
        </>
    )
}
export default YogaComponent