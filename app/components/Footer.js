import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    const footerStyle = {
        height: "16%",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        borderTop: "5px solid var(--secondary-color)",
        backgroundColor: "var(--primary-color)",
        paddingTop: "16px",
        fontSize: "13px",
    };

    const linkStyle = {
        color: "var(--secondary-light-color)",
    };

    const copyrightStyle = {
        color: "var(--light-grey-color)",
    };

    const homeLinkStyle = {
        color: "var(--light-grey-color)",
        fontWeight: "bold",
    };

    return (
        <>
            <footer style={footerStyle}>
                <p>
                    <Link to="/" style={linkStyle}>
                        Home
                    </Link>{" "}
                    <b style={{ color: "var(--light-grey-color)" }}> | </b>
                    <Link style={linkStyle} to="/about-us">
                        About Us
                    </Link>{" "}
                    <b style={{ color: "var(--light-grey-color)" }}> | </b>
                    <Link style={linkStyle} to="/terms">
                        Terms
                    </Link>
                </p>
                <p style={copyrightStyle}>
                    Copyright &copy; 2020{" "}
                    <Link to="/" style={homeLinkStyle}>
                        Ba Sing Scribes
                    </Link>
                    . All rights reserved.
                </p>
            </footer>
        </>
    );
}

export default Footer;
