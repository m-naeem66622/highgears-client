import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Page404 from "./pages/Page404";
import { ToastContainer } from "react-toastify";
import { adminRoutes, privateRoutes, publicRoutes } from "./Routes";
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoutes";
import Footer from "./components/Footer";
import ChatButton from "./components/ChatButton";

function App() {
  document.title = "Grand Online Store | Spend less, Save more";
  return (
    <>
      <ChatButton />
      <ToastContainer position="top-right" autoClose={2500} theme="light" />
      <Header />
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4 xl:px-0">
        <Routes>
          <Route path="*" element={<Page404 />} />

          {publicRoutes.map((route) => (
            <Route key={route.path} {...route} />
          ))}

          <Route element={<PrivateRoute />}>
            {privateRoutes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            {adminRoutes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
