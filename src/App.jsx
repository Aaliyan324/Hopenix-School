import { useState } from 'react'
import './App.css'
import Hero from './sections/Hero'
import AboutUs from './sections/AboutUs'
import Academics from './sections/Academics'
import Admissions from './sections/Admissions'
import Testimonials from './sections/Testimonials'

function App() {

  return (
    <>
      <Hero/>
      <AboutUs/>
      <Academics/>
      <Admissions/>
      <Testimonials/>
    </>
  )
}

export default App
