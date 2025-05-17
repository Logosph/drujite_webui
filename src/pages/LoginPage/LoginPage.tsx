import React, {useEffect, useState} from "react";
import LoginCard from "../../components/LoginCard/LoginCard";
import "./LoginPage.css";
import api from "../../data/axios-instance"
import {useNavigate} from "react-router-dom";

const LoginPage: React.FC = () => {

    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/api/v1/user/me");
                navigate("/");
            } catch (error) {
                // Здесь можно обработать ошибку дополнительно, если нужно
                console.error("Ошибка при получении данных пользователя", error);
                // 401 автоматически редиректит в интерсепторе
                // Остальные ошибки можешь обработать тут
                if (error.response && error.response.status !== 401) {
                    navigate("/error");
                }
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogin = async () => {
        try {
            const response = await api.post("/api/v1/auth", {
                phone,
                password,
            });
            const token = response.data.token;
            document.cookie = `token=${token}; path=/; max-age=${30 * 24 * 60 * 60}`;
            navigate("/");

        } catch (error) {
            setMessage(
                `Ошибка: ${error.response?.data?.message || "Не удалось войти"}`
            );
        }
    };

    return (
        <div className="wrapper">
            <LoginCard
                phone={phone}
                password={password}
                message={message}
                onPhoneChange={(e) => setPhone(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onLogin={handleLogin}
            />
        </div>
    );
};

export default LoginPage;
