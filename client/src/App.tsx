import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import SginIn from "./pages/SginIn";
import SginUp from "./pages/SginUp";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/sgin-in" element={<SginIn />} />
        <Route path="/sgin-up" element={<SginUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="*"
          element={
            <div className="h-screen grid place-items-center">
              <h1 className="text-4xl text-center font-extrabold">NOT FOUND</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
