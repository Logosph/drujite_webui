import React from "react";
import "./DefaultButton.css";

interface DefaultButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
}

const DefaultButton: React.FC<DefaultButtonProps> = ({ children, onClick, type = "button" }) => {
    return (
        <button className="default-button" onClick={onClick} type={type}>
            {children}
        </button>
    );
};

export default DefaultButton;
