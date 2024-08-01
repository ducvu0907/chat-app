import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

export default function App() {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={authUser ? <Navigate to={"/"} /> : <Login />} />
        <Route path="/register" element={authUser ? <Navigate to={"/"} /> : <Signup />} />
      </Routes>
      <Toaster />
    </div>
  )
}