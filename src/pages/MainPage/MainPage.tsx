import React, {useEffect, useState} from "react";
import "./MainPage.css";
import BaseCard from "../../components/BaseCard/BaseCard";
import LinearLayout from "../../components/Layouts/LinearLayout";
import {redirect, useNavigate} from "react-router-dom";
import api from "../../data/axios-instance";
import OptionsCard from "../../components/OptionsCard/OptionsCard";

const MainPage: React.FC = () => {
    // const [phone, setPhone] = useState<string>("");
    // const [password, setPassword] = useState<string>("");
    // const [passwordRepeat, setPasswordRepeat] = useState<string>("");
    // const [message, setMessage] = useState<string>("");
    //
    // const handleLogin = async () => {
    //     try {
    //         const response = await axios.post("https://drujite-server.onrender.com/api/v1/auth", {
    //             phone,
    //             password,
    //         });
    //         setMessage(`Успешный вход: ${JSON.stringify(response.data)}`);
    //     } catch (error) {
    //         setMessage(
    //             `Ошибка: ${error.response?.data?.message || "Не удалось войти"}`
    //         );
    //     }
    // };


    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/api/v1/user/me");
                setUser(response.data);
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

    return (
        <LinearLayout orientation="vertical" className="main-page-wrapper">
            <LinearLayout orientation="horizontal" className="upper-cards-wrapper">
                <BaseCard className="title-card">
                    <h1>Дружите.ру</h1>
                    <h2>Панель администратора</h2>
                    <p className="title-card-description">Управляйте информацией о сменах, кланах, добавляйте и редактируйте новости и многое другое!</p>
                </BaseCard>
                <BaseCard className="title-page-image-wrapper">
                    <img src="/title_page.jpg" alt="смена" className="title-page-image"/>
                </BaseCard>
            </LinearLayout>

            <h2 className="tools-header">Инструменты</h2>

            <LinearLayout orientation="horizontal" className="lower-cards-wrapper">
                <OptionsCard imgSrc="/title_page.jpg" title="Смены" imgAlt="смена" onClick={() => { navigate("/sessions") }}/>
                <OptionsCard imgSrc="/title_page.jpg" title="Кланы" imgAlt="смена" onClick={() => {}}/>
                {/*<OptionsCard imgSrc="/title_page.jpg" title="Новости" imgAlt="смена" onClick={() => {}}/>*/}
            </LinearLayout>
        </LinearLayout>
    );
};

export default MainPage;
