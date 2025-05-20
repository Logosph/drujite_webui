import React, { useEffect, useState } from "react";
import "./MainPage.css";
import BaseCard from "../../components/BaseCard/BaseCard";
import LinearLayout from "../../components/Layouts/LinearLayout";
import { useNavigate } from "react-router-dom";
import api from "../../data/axios-instance";
import OptionsCard from "../../components/OptionsCard/OptionsCard";

interface User {
    username: string;
    phone: string;
}

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/api/v1/user/me");
                setUser(response.data);
            } catch (error) {
                console.error("Ошибка при получении данных пользователя", error);
                if (error.response?.status !== 401) {
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
                    <p className="title-card-description">
                        Добро пожаловать{user ? `, ${user.username}` : ''}! Здесь вы можете управлять всей информацией о сменах, 
                        их участниках, целях и достижениях.
                    </p>
                </BaseCard>
                <BaseCard className="title-page-image-wrapper">
                    <img 
                        src={process.env.PUBLIC_URL + "/img_fish.png"} 
                        alt="Администрирование" 
                        className="title-page-image"
                    />
                </BaseCard>
            </LinearLayout>

            <div className="main-tool-section">
                <h2 className="tools-header">Управление сменами</h2>
                <OptionsCard
                    imgSrc="/img_fish.png"
                    title="Смены"
                    description="Управление сменами, персонажами и их целями"
                    imgAlt="смены"
                    onClick={() => navigate("/sessions")}
                />
            </div>
        </LinearLayout>
    );
};

export default MainPage;
