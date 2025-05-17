import React from "react";

import "./LinearLayout.css";

interface LinearLayoutProps {
    children: React.ReactNode;
    orientation?: "horizontal" | "vertical";
    className?: string;
}

const LinearLayout: React.FC<LinearLayoutProps> = ({children, orientation="vertical", className=""}) => {
    return (
        <div className={`${orientation} ${className}`}>
            {children}
        </div>
    );
};

export default LinearLayout;
