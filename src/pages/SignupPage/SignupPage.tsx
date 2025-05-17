import React, {useState} from "react";
import axios from "axios";
import "./SignupPage.css";
import SignupCard from "../../components/SignupCard/SignupCard";

const SignupPage: React.FC = () => {
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordRepeat, setPasswordRepeat] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("https://drujite-server.onrender.com/api/v1/auth", {
                phone,
                password,
            });
            setMessage(`Успешный вход: ${JSON.stringify(response.data)}`);
        } catch (error) {
            setMessage(
                `Ошибка: ${error.response?.data?.message || "Не удалось войти"}`
            );
        }
    };

    return (
        <div className="wrapper">
            <SignupCard
                phone={phone}
                password={password}
                passwordRepeat={passwordRepeat}
                message={message}
                onPhoneChange={(e) => setPhone(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onPasswordRepeatChange={(e) => setPasswordRepeat(e.target.value)}
                onSignUp={handleLogin}
            />
        </div>
    );
};

export default SignupPage;
