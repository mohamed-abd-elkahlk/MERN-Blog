import { BrowserRouter, Route, Routes } from "react-router-dom";

import Nav from "./components/Nav";
import FooterComponent from "./components/Footer";
import { About, Dashboard, Home, Projects, SginIn, SginUp } from "./pages";
import PrivteRoutes from "./context/PrivteRoutes";
import AdminPrivteRoutes from "./context/AdminPrivteRoutes";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import Post from "./pages/Post";
import ScrollToTob from "./components/shared/ScrollToTob";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTob />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/sign-in" element={<SginIn />} />
        <Route path="/sign-up" element={<SginUp />} />
        <Route path="/post/:id" element={<Post />} />
        <Route element={<PrivteRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivteRoutes />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<UpdatePost />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="h-screen grid place-items-center">
              <h1 className="text-4xl text-center font-extrabold">
                404 NOT FOUND
              </h1>
            </div>
          }
        />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
