import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import MainPage from "./pages/MainPage/MainPage";
import SessionsPage from "./pages/SessionsPage/SessionsPage";
import ChosenSessionPage from "./pages/ChosenSessionPage/ChosenSessionPage";
import Navbar from "./components/Navbar/Navbar";

const AppContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        navigate('/login');
    };

    // Don't show navbar on login and signup pages
    const showNavbar = !['/login', '/signup'].includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar onLogout={handleLogout} />}
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>
                <Route path="/sessions" element={<SessionsPage/>}/>
                <Route path="/session/:id" element={<ChosenSessionPage/>}/>
                <Route path="/" element={<MainPage/>}/>
            </Routes>
        </>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;

