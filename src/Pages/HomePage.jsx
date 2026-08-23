import React from 'react'
import Hero from '../HomePageSections/Hero'
import AboutUs from '../HomePageSections/AboutUs'
import Academics from '../HomePageSections/Academics'
import Admissions from '../HomePageSections/Admissions'
import Contact from '../HomePageSections/ContactUs'
import Testimonials from '../HomePageSections/Testimonials'

const HomePage = () => {
  return (
    <>
        <Hero/>
        <AboutUs/>
        <Academics/>
        <Admissions/>
        <Testimonials/>
        <Contact/>
    </>
  )
}

export default HomePage