import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartRescuingPage from "./components/Rescue/Rescue";
import Landing from "./components/Landing";
import DetectDiseasePage from "./components/Disease/DiseaseDetect";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
      </Routes>
    </div>
    <Footer />
  </Router>
);

export default App;
