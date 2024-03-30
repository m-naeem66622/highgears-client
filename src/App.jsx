import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Page404 from "./pages/Page404";
import { ToastContainer } from "react-toastify";
import { adminRoutes, privateRoutes, publicRoutes } from "./Routes";
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoutes";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
