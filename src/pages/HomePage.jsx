import React from 'react'
import Header from './Header'
import Footer from './Footer'
import '../styles/homePage.css'

export const HomePage = () => {
  return (
    <div className='app-container'>

        <Header/>

        <main className='main-content'>

          <p className='text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius quas minima, quibusdam sapiente illum voluptas tempore quaerat adipisci? Deleniti nobis dolores, quisquam cupiditate culpa maiores laborum velit quidem quam?</p>

        </main>
        
        <Footer/>

    </div>
  )
}
