import { useState } from 'react'
import './App.css'
import Hero from './sections/Hero'
import AboutUs from './sections/AboutUs'
import Academics from './sections/Academics'
import Admissions from './sections/Admissions'
import Testimonials from './sections/Testimonials'
import ContactUs from './sections/ContactUs'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <Navbar />
      <Hero />
      <AboutUs />
      <Academics />
      <Admissions />
      <Testimonials />
      <ContactUs />
      <Footer />
    </>
  )
}

export default App
