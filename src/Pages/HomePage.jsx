import Hero from '../HomePageSections/Hero'
import AboutUs from '../HomePageSections/AboutUs'
import Academics from '../HomePageSections/Academics'
import Admissions from '../HomePageSections/Admissions'
import Contact from '../HomePageSections/ContactUs'
import Testimonials from '../HomePageSections/Testimonials'
import UpcomingEvents from '../HomePageSections/UpcomingEvents'
import FloatingQuickActions from '../components/FloatingQuickActions'

const HomePage = () => {
  return (
    <>
        <Hero/>
        <UpcomingEvents/>
        <AboutUs/>
        <Academics/>
        <Admissions/>
        <Testimonials/>
        <Contact/>
        <FloatingQuickActions/>
    </>
  )
}

export default HomePage
