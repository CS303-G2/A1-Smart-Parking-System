import Background from "./Background";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserInfo } from "../store/index.js";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  const updateUser = async (token) => {
    const res = await getUserInfo(token);
    setUser(res);
  };
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/sign-in");
    } else {
      updateUser(token);
    }
  }, []);
  return (
    <div className="h-screen max-h-[100vh] overflow-hidden relative">
      {/* Navbar */}
      <Navbar />

      {/* Background */}
      <Background brightness={0.9} />

      {/* Hero Section */}
      {user && (
        <div className="h-screen flex flex-col justify-center items-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg text-center animate-fadeIn">
            Welcome, {user.user.username}
          </h1>
          <p className="text-xl md:text-2xl text-white font-light mb-10 text-center">
            Experience hassle-free parking with our automated solution.
          </p>
          <Link to="/book">
            <button className=" cursor-pointer px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 animate-bounce">
              Book a Slot Now
            </button>
          </Link>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-800 opacity-80"></div>

      {/* Footer Section */}
      <footer className="absolute bottom-4 w-full text-center text-white font-light">
        <p>© 2025 Parking Point. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
