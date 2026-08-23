import { useState } from 'react'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HomePage from './Pages/HomePage'

function App() {

  return (
    <>
      <Navbar />
      <HomePage/>
      <Footer />
    </>
  )
}

export default App
