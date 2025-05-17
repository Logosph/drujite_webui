import React from "react";
import "./DefaultInput.css";

interface DefaultInputProps {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DefaultInput: React.FC<DefaultInputProps> = ({
                                                       type = "text",
                                                       placeholder,
                                                       value,
                                                       onChange,
                                                   }) => {
    return (
        <input
            className="default-input"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

export default DefaultInput;
