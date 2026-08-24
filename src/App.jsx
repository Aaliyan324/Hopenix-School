import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HomePage from './Pages/HomePage'
import About from './Pages/About'
import Academics from './Pages/Academics'
import Facilities from './Pages/Facilities'
import StudentLife from './Pages/StudentLife'
import Faculty from './Pages/Faculty'
import Events from './Pages/Events'
import EventDetails from './Pages/EventDetails'
import News from './Pages/News'
import NewsDetails from './Pages/NewsDetails'
import Gallery from './Pages/Gallery'
import Admissions from './Pages/Admissions'
import AdmissionForm from './Pages/AdmissionForm'
import Contact from './Pages/Contact'
import FAQ from './Pages/FAQ'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import Terms from './Pages/Terms'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminEvents from './admin/AdminEvents'
import AdminSettings from './admin/AdminSettings'
import AdminAdmissions from './admin/AdminAdmissions'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Admin — all routes share one AuthProvider */}
          <Route element={<AuthProvider><Outlet /></AuthProvider>}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="admissions" element={<AdminAdmissions />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Public website — navbar + footer */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/academics" element={<Academics />} />
                    <Route path="/facilities" element={<Facilities />} />
                    <Route path="/student-life" element={<StudentLife />} />
                    <Route path="/faculty" element={<Faculty />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:id" element={<NewsDetails />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/admissions" element={<Admissions />} />
                    <Route path="/admissions/apply" element={<AdmissionForm />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
