import { useState } from 'react'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HomePage from './Pages/HomePage'
import Events from './Pages/Events'

function App() {

  return (
    <>
      <Navbar />
      <Events/>
      <Footer />
    </>
  )
}

export default App
