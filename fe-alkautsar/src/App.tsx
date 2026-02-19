import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Struktur from "./pages/struktur"; // pastikan huruf kapital

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/struktur-organisasi" element={<Struktur />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
