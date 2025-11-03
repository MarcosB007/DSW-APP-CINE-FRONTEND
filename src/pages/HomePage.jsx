import React from 'react'
import Header from './Header'
import Footer from './Footer'
import MovieList from './MovieList'
import '../styles/homePage.css'

export const HomePage = () => {
  return (
    <div className='app-container'>

        <Header/>

        <main className='main-content'>

            <MovieList />

        </main>
        
        <Footer/>

    </div>
  )
}
