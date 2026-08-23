import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HomePage from './Pages/HomePage'
import Events from './Pages/Events'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
