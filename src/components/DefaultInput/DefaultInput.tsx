import React from "react";
import "./DefaultInput.css";

interface DefaultInputProps {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const DefaultInput: React.FC<DefaultInputProps> = ({
                                                       type = "text",
                                                       placeholder,
                                                       value,
                                                       onChange,
                                                       className
                                                   }) => {
    return (
        <input
            className={`default-input ${className}`}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

export default DefaultInput;
