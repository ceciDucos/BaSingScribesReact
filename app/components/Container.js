import React, { useEffect } from "react";

function Container(props) {
    const containerStyle = {
        padding: "100px 0",
        minHeight: "75%",
    };

    return (
        <div className="container" style={containerStyle}>
            {props.children}
        </div>
    );
}

export default Container;
