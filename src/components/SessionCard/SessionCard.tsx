import React from "react";
import {concatUrl} from "../../data/axios-instance";
import BaseCard from "../BaseCard/BaseCard";
import LinearLayout from "../Layouts/LinearLayout";
import "./SessionCard.css"

interface SessionCardProps {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string | null;
}

const SessionCard: React.FC<SessionCardProps> = ({
                                                     id, name, description, startDate, endDate, imageUrl
                                                 }) => {
    return (
        <BaseCard className="session-card">
            <LinearLayout orientation="vertical" className="session-card__layout">
                <h2>{id}</h2>
                <h2>{name}</h2>
                <p>{description}</p>
                <p>{startDate}</p>
                <p>{endDate}</p>
                <img src={concatUrl(`/${imageUrl}`, true)} alt={name} />
            </LinearLayout>
        </BaseCard>
    );
};

export default SessionCard;
