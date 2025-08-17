import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartRescuingPage from "./components/StartRescuingPage";
import Landing from "./components/Landing";
import DetectDiseasePage from "./components/DiseaseDetect";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/adopt" element={<StartRescuingPage />} />
      <Route path="/disease" element={<DetectDiseasePage />} />
    </Routes>
  </Router>
);

export default App;
