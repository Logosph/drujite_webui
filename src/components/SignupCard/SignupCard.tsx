import React from "react";
import DefaultInput from "../DefaultInput/DefaultInput";
import DefaultButton from "../DefaultButton/DefaultButton";
import {Link} from "react-router-dom";
import "./SignupCard.css";
import BaseCard from "../BaseCard/BaseCard";

interface SignupCardProps {
    phone: string;
    password: string;
    passwordRepeat: string;
    message?: string;
    onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordRepeatChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSignUp: () => void;
}

const SignupCard: React.FC<SignupCardProps> = ({
                                                   phone,
                                                   password,
                                                   passwordRepeat,
                                                   message,
                                                   onPhoneChange,
                                                   onPasswordChange,
                                                   onPasswordRepeatChange,
                                                   onSignUp,
                                               }) => {
    return (
        <BaseCard>
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">Регистрация</h2>
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
                <DefaultInput
                    type="password"
                    placeholder="Повторите пароль"
                    value={passwordRepeat}
                    onChange={onPasswordRepeatChange}
                />

                <DefaultButton onClick={onSignUp}>Зарегистрироваться</DefaultButton>
                {message && (
                    <div className="mt-4 text-sm text-center text-white">{message}</div>
                )}

            </div>
            <p>Уже зарегистрированы? <Link to="/login">Войти</Link></p>
        </BaseCard>
    );
};

export default SignupCard;
