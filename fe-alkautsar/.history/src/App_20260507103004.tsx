import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Struktur from "./pages/struktur"; // pastikan huruf kapital
import AdminPage from "./pages/admin";
import PpdbPage from "./pages/ppdb";
import cors from "cors";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/struktur-organisasi" element={<Struktur />} />
        <Route path="/ppdb" element={<PpdbPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
