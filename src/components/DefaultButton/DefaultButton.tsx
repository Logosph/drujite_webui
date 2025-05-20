import React from "react";
import "./DefaultButton.css";

interface DefaultButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    className?: string;
}

const DefaultButton: React.FC<DefaultButtonProps> = ({ children, onClick, type = "button", className = "" }) => {
    return (
        <button className={`default-button ${className}`} onClick={onClick} type={type}>
            {children}
        </button>
    );
};

export default DefaultButton;
