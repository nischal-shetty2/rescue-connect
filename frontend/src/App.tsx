import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StartRescuingPage from './components/Rescue/Rescue'
import Landing from './components/Landing'
import DetectDiseasePage from './components/Disease/DiseaseDetect'
import Login from './components/Login'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Marketplace from './components/Marketplace/marketplace'
import Donation from './components/Donation/Donation'

const App = () => (
  <Router>
    <Navbar />
    <div className="">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/adopt" element={<StartRescuingPage />} />
        <Route path="/disease" element={<DetectDiseasePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/donation" element={<Donation />} />
      </Routes>
    </div>
    <Footer />
  </Router>
)

export default App
