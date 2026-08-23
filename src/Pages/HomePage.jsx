import Hero from '../HomePageSections/Hero'
import AboutUs from '../HomePageSections/AboutUs'
import Academics from '../HomePageSections/Academics'
import Admissions from '../HomePageSections/Admissions'
import Contact from '../HomePageSections/ContactUs'
import Testimonials from '../HomePageSections/Testimonials'
import UpcomingEvents from '../HomePageSections/UpcomingEvents'
import FloatingEventWidget from '../components/FloatingEventWidget'
import FloatingQuickActions from '../components/FloatingQuickActions'

const HomePage = () => {
  return (
    <>
        <Hero/>
        <AboutUs/>
        <Academics/>
        <Admissions/>
        <UpcomingEvents/>
        <Testimonials/>
        <Contact/>
        <FloatingEventWidget/>
        <FloatingQuickActions/>
    </>
  )
}

export default HomePage
