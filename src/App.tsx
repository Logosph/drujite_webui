import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import MainPage from "./pages/MainPage/MainPage";
import SessionsPage from "./pages/SessionsPage/SessionsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>
                <Route path="/sessions" element={<SessionsPage/>}/>
                <Route path="/" element={<MainPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;

