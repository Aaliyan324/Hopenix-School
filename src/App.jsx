import { BrowserRouter as Router, Routes as RouterRoutes, Route as RouterRoute } from 'react-router-dom'
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
import DailyDiary from './Pages/DailyDiary'
import Contact from './Pages/Contact'
import FAQ from './Pages/FAQ'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import Terms from './Pages/Terms'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

// Admin Views
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminTeachers from './admin/AdminTeachers'
import AdminClasses from './admin/AdminClasses'
import AdminDiary from './admin/AdminDiary'
import AdminEvents from './admin/AdminEvents'
import AdminSettings from './admin/AdminSettings'
import AdminAdmissions from './admin/AdminAdmissions'

// Teacher Views
import TeacherLayout from './teacher/TeacherLayout'
import TeacherDashboard from './teacher/TeacherDashboard'
import TeacherDiaryManager from './teacher/TeacherDiaryManager'
import TeacherProfile from './teacher/TeacherProfile'

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <RouterRoutes>
            {/* Unified Staff / Admin Login */}
            <RouterRoute path="/admin/login" element={<AdminLogin />} />
            <RouterRoute path="/teacher/login" element={<AdminLogin />} />

            {/* Teacher Portal */}
            <RouterRoute path="/teacher" element={<TeacherLayout />}>
              <RouterRoute index element={<TeacherDashboard />} />
              <RouterRoute path="diary" element={<TeacherDiaryManager />} />
              <RouterRoute path="profile" element={<TeacherProfile />} />
            </RouterRoute>

            {/* Admin Control Panel */}
            <RouterRoute path="/admin" element={<AdminLayout />}>
              <RouterRoute index element={<AdminDashboard />} />
              <RouterRoute path="teachers" element={<AdminTeachers />} />
              <RouterRoute path="classes" element={<AdminClasses />} />
              <RouterRoute path="diary" element={<AdminDiary />} />
              <RouterRoute path="events" element={<AdminEvents />} />
              <RouterRoute path="admissions" element={<AdminAdmissions />} />
              <RouterRoute path="settings" element={<AdminSettings />} />
            </RouterRoute>

            {/* Public Website Routes (Navbar + Footer) */}
            <RouterRoute
              path="/*"
              element={
                <>
                  <Navbar />
                  <main>
                    <RouterRoutes>
                      <RouterRoute path="/" element={<HomePage />} />
                      <RouterRoute path="/about" element={<About />} />
                      <RouterRoute path="/academics" element={<Academics />} />
                      <RouterRoute path="/facilities" element={<Facilities />} />
                      <RouterRoute path="/student-life" element={<StudentLife />} />
                      <RouterRoute path="/faculty" element={<Faculty />} />
                      <RouterRoute path="/events" element={<Events />} />
                      <RouterRoute path="/events/:id" element={<EventDetails />} />
                      <RouterRoute path="/news" element={<News />} />
                      <RouterRoute path="/news/:id" element={<NewsDetails />} />
                      <RouterRoute path="/gallery" element={<Gallery />} />
                      <RouterRoute path="/daily-diary" element={<DailyDiary />} />
                      <RouterRoute path="/admissions" element={<Admissions />} />
                      <RouterRoute path="/admissions/apply" element={<AdmissionForm />} />
                      <RouterRoute path="/contact" element={<Contact />} />
                      <RouterRoute path="/faq" element={<FAQ />} />
                      <RouterRoute path="/privacy-policy" element={<PrivacyPolicy />} />
                      <RouterRoute path="/terms" element={<Terms />} />
                    </RouterRoutes>
                  </main>
                  <Footer />
                </>
              }
            />
          </RouterRoutes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
