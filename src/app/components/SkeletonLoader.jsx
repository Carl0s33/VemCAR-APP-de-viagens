import React from "react";
import "./style/SkeletonLoader.css";

const SkeletonLoader = ({ width, height, borderRadius }) => {
    return (
        <div
            className="skeleton-loader"
            style={{ width, height, borderRadius }}
        ></div>
    );
};

export default SkeletonLoader;
