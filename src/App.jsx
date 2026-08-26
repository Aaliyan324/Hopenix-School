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
import DailyDiary from './Pages/DailyDiary'

import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminTeachers from './admin/AdminTeachers'
import AdminClasses from './admin/AdminClasses'
import AdminDiary from './admin/AdminDiary'
import AdminEvents from './admin/AdminEvents'
import AdminSettings from './admin/AdminSettings'
import AdminAdmissions from './admin/AdminAdmissions'

import TeacherLayout from './teacher/TeacherLayout'
import TeacherDashboard from './teacher/TeacherDashboard'
import TeacherDiary from './teacher/TeacherDiary'
import TeacherClasses from './teacher/TeacherClasses'
import TeacherProfile from './teacher/TeacherProfile'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="teachers" element={<AdminTeachers />} />
              <Route path="classes" element={<AdminClasses />} />
              <Route path="diary" element={<AdminDiary />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="admissions" element={<AdminAdmissions />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Protected Teacher Portal Routes */}
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="diary" element={<TeacherDiary />} />
              <Route path="classes" element={<TeacherClasses />} />
              <Route path="profile" element={<TeacherProfile />} />
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
                      <Route path="/daily-diary" element={<DailyDiary />} />
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
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
