import React from "react";

import "./BaseCard.css";

interface BaseCardProps {
    children: React.ReactNode;
    className?: string
    onClick?: () => void
}

const BaseCard: React.FC<BaseCardProps> = ({
                                               children,
                                               className = "",
                                               onClick = () => {
                                               }
                                           }) => {
    return (
        <div className={`${className} base-card`} onClick={onClick}>
            {children}
        </div>
    );
};

export default BaseCard;
