import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/Signin.jsx";
import SignUp from "./components/SignUp.jsx";
import Dashboard from "./components/Dashboard";
import Bookslot from "./components/Bookslot";
import Bookings from "./components/Bookings.jsx";
import { ToastContainer } from "react-toastify";

// import AdminDashboard from './components/AdminDashboard'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book" element={<Bookslot />} />
        <Route path="/bookings" element={<Bookings />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
