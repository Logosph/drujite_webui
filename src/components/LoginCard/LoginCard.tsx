import React from "react";
import DefaultInput from "../DefaultInput/DefaultInput";
import DefaultButton from "../DefaultButton/DefaultButton";
import "./LoginCard.css";
import BaseCard from "../BaseCard/BaseCard";
import LinearLayout from "../Layouts/LinearLayout";

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
        <BaseCard className="login-card">
            <LinearLayout className="login-card__layout">
                <div className="login-card__header">
                    <h1 className="login-card__title">Добро пожаловать</h1>
                    <p className="login-card__subtitle">Войдите в свой аккаунт</p>
                </div>

                <div className="input-form">
                    <DefaultInput
                        type="text"
                        placeholder="Телефон"
                        value={phone}
                        onChange={onPhoneChange}
                        className="login-card__input"
                    />
                    <DefaultInput
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={onPasswordChange}
                        className="login-card__input"
                    />

                    <DefaultButton onClick={onLogin} className="login-card__button">
                        Войти
                    </DefaultButton>

                    {message && (
                        <div className="login-card__message error">
                            {message}
                        </div>
                    )}
                </div>
            </LinearLayout>
        </BaseCard>
    );
};

export default LoginCard;
