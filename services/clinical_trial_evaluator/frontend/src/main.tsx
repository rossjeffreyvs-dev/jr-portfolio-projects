import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/index";
import AddPatientForm from "./components/AddPatientForm";
import ReviewPatientForm from "./components/ReviewPatientForm";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddPatientForm />} />
        <Route path="/review/:id" element={<ReviewPatientForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
