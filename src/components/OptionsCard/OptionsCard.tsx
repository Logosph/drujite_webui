import React from "react";
import "./OptionsCard.css";
import BaseCard from "../BaseCard/BaseCard";
import LinearLayout from "../Layouts/LinearLayout";

interface OptionsCardProps {
    imgSrc: string;
    imgAlt: string;
    onClick: () => void;
    title: string;
    description: string;
}

const OptionsCard: React.FC<OptionsCardProps> = ({
                                                     imgSrc,
                                                     imgAlt,
                                                     onClick,
    title,
    description
                                                 }) => {
    return (
        <BaseCard className="options-card" onClick={onClick}>
            <LinearLayout orientation="vertical" className="options-card__layout">
                <img src={imgSrc} alt={imgAlt} className="options-card__image"/>
                <div className="options-card__content">
                    <h3 className="options-card__title">{title}</h3>
                    <p className="options-card__description">{description}</p>
                </div>
            </LinearLayout>
        </BaseCard>
    );
};

export default OptionsCard;
