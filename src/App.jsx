import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HomePage from './Pages/HomePage'
import Events from './Pages/Events'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminEvents from './admin/AdminEvents'
import AdminSettings from './admin/AdminSettings'
import AdminAdmissions from './admin/AdminAdmissions'
import Admissions from './Pages/Admissions'
import AdmissionForm from './Pages/AdmissionForm'

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
                    <Route path="/events" element={<Events />} />
                    <Route path="/admissions" element={<Admissions />} />
                    <Route path="/admissions/apply" element={<AdmissionForm />} />
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
