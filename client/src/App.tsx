import { BrowserRouter, Route, Routes } from "react-router-dom";

import Nav from "./components/Nav";
import FooterComponent from "./components/Footer";
import { About, Dashboard, Home, Projects, SginIn, SginUp } from "./pages";
function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/sign-in" element={<SginIn />} />
        <Route path="/sign-up" element={<SginUp />} />
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
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
