import React from "react";
import {concatUrl} from "../../data/axios-instance";
import BaseCard from "../BaseCard/BaseCard";
import LinearLayout from "../Layouts/LinearLayout";
import "./SessionCard.css"
import api from "../../data/axios-instance"
import { useNavigate } from "react-router-dom";

interface SessionCardProps {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string | null;
    clickable?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({
                                                     id, name, description, startDate, endDate, imageUrl, clickable = true
                                                 }) => {
    const navigate = useNavigate();

    const handleDeletion = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        console.log(`${id} is here`)
        await api.delete(
            `/api/v1/session?id=${id}`
        )
        window.location.reload()
    }

    const handleClick = () => {
        if (clickable) {
            navigate(`/session/${id}`);
        }
    };

    return (
        <BaseCard 
            className={`session-card ${clickable ? 'clickable' : ''}`} 
            onClick={handleClick}
        >
            <LinearLayout orientation="horizontal" className="session-card__wrapper">
                <LinearLayout orientation="vertical" className="session-card__layout">
                    <LinearLayout orientation="horizontal" className="session-card__title-layout">
                        <img className="session-card__icon"
                             src={imageUrl === null ? "/img_fish.png" : concatUrl(`/${imageUrl}`, true)}
                             alt={name}
                        />

                        <h2>{name}</h2>
                    </LinearLayout>

                    <p className="session-card__description">{description}</p>


                </LinearLayout>
                <LinearLayout className="Dates">
                    <LinearLayout orientation="horizontal">
                        <img className="session-card__date-ic session-card__icon" src="/icons/ic_start_date.svg" alt="start date"/>
                        <p className="session-card__date">Начало: {startDate.split("T")[0]}</p>
                    </LinearLayout>

                    <LinearLayout orientation="horizontal">
                        <img className="session-card__date-ic session-card__icon" src="/icons/ic_start_date.svg" alt="start date"/>
                        <p className="session-card__date">Конец: {endDate.split("T")[0]}</p>
                    </LinearLayout>

                </LinearLayout>

                <div className="session-card__delete-wrapper">
                    <img className="session-card__delete_button" alt="delete card" src="/icons/ic_delete.svg" onClick={handleDeletion}/>
                </div>

            </LinearLayout>
        </BaseCard>
    );
};

export default SessionCard;
