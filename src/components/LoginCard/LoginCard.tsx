import React from "react";
import DefaultInput from "../DefaultInput/DefaultInput";
import DefaultButton from "../DefaultButton/DefaultButton";
import {Link} from "react-router-dom";
import "./LoginCard.css";
import BaseCard from "../BaseCard/BaseCard";

interface LoginCardProps {
    phone: string;
    password: string;
    message?: string;
    onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLogin: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
                                                 phone,
                                                 password,
                                                 message,
                                                 onPhoneChange,
                                                 onPasswordChange,
                                                 onLogin,
                                             }) => {
    return (
        <BaseCard>
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">Вход</h2>
            <div className="input-form">
                <DefaultInput
                    type="text"
                    placeholder="Телефон"
                    value={phone}
                    onChange={onPhoneChange}
                />
                <DefaultInput
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={onPasswordChange}
                />

                <DefaultButton onClick={onLogin}>Войти</DefaultButton>

                {message && (
                    <div className="mt-4 text-sm text-center text-white">{message}</div>
                )}

            </div>
            <p>Ещё нет аккаунта? <Link to="/signup">Зарегистрироваться</Link></p>
        </BaseCard>
    );
};

export default LoginCard;
