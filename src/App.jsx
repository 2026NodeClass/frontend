import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Explore from "./pages/Explore.jsx";
import Galaxy3D from "./pages/Galaxy3D.jsx";
import PlanetDetail from "./pages/PlanetDetail.jsx";
import AdminConsole from "./pages/AdminConsole.jsx";
import VoyageMap from "./pages/VoyageMap.jsx";
import CursorGlow from "./components/CursorGlow.jsx";

export default function App() {
  return (
    <>
      <CursorGlow />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/galaxy" element={<Galaxy3D />} />
        <Route path="/planet/:id" element={<PlanetDetail />} />
        <Route path="/admin" element={<AdminConsole />} />
        <Route path="/voyage" element={<VoyageMap />} />
      </Routes>
    </>
  );
}
