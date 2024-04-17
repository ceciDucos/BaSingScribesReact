import React, { useContext, useState } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function HeaderLoggedOut() {
    const appDispatch = useContext(DispatchContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await Axios.post("/login", { username, password });
            if (response.data) {
                appDispatch({ type: "login", data: response.data });
                appDispatch({
                    type: "flashMessages",
                    value: "You have successfully logged in.",
                });
            } else {
                appDispatch({
                    type: "flashMessages",
                    value: "Invalid username / password.",
                });
            }
        } catch (error) {
            console.log("Login error:", error);
        }
    }

    // Style definitions refined to match the Earth Kingdom theme more closely
    const formStyle = {
        padding: "10px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    };

    const inputStyle = {
        backgroundColor: "#2F4F4F", // Dark Slate Gray for input backgrounds
        color: "#F0E68C", // Khaki for input text
        border: `1px solid #6E8B3D`, // Bamboo Green for borders
        padding: "5px",
        borderRadius: "2px", // Slight rounding of corners
        width: "100%", // Full-width inputs
        marginRight: "10px", // Spacing between input and button
    };

    const buttonStyle = {
        backgroundColor: "#487D49", // Jade Green for the button
        color: "#F0E68C", // A pale golden color for button text
        border: "none",
        padding: "6px 12px",
        borderRadius: "2px",
        cursor: "pointer",
        fontWeight: "bold",
        // Flex settings to ensure button does not stretch
        flexShrink: 0,
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <input
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                className="form-control form-control-sm input-dark"
                type="text"
                placeholder="Username"
                autoComplete="off"
                style={inputStyle}
            />
            <input
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                className="form-control form-control-sm input-dark"
                type="password"
                placeholder="Password"
                style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
                Sign In
            </button>
        </form>
    );
}

export default HeaderLoggedOut;
