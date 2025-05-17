import React from "react";
import DefaultInput from "../DefaultInput/DefaultInput";
import DefaultButton from "../DefaultButton/DefaultButton";
import {Link} from "react-router-dom";
import "./OptionsCard.css";
import BaseCard from "../BaseCard/BaseCard";

interface OptionsCardProps {
    imgSrc: string;
    imgAlt: string;
    onClick: () => void
    title: string;
}

const OptionsCard: React.FC<OptionsCardProps> = ({
                                                     imgSrc,
                                                     imgAlt,
                                                     onClick,
                                                     title
                                                 }) => {
    return (
        <BaseCard className="options-card" onClick={onClick}>
            <img src={imgSrc} alt={imgAlt} className="options-card-image"/>
            <p className="options-card-title">{title}</p>
        </BaseCard>
    );
};

export default OptionsCard;
