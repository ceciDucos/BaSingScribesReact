import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import StateContext from "../StateContext";

function Header(props) {
    const appState = useContext(StateContext);
    const headerContent = appState.loggedIn ? (
        <HeaderLoggedIn />
    ) : (
        <HeaderLoggedOut />
    );

    const headerStyle = {
        backgroundColor: "var(--primary-color)",
        padding: "10px 20px",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "18px",
        borderBottom: "5px solid var(--secondary-color)",
        height: "9%",
        display: "flex",
    };

    const logoStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        fontWeight: "500",
        color: "var(--secondary-light-color)",
        textDecoration: "none",
    };

    return (
        <header className="header-bar" style={headerStyle}>
            <div className="container d-flex justify-content-between align-items-center">
                <h4 className="my-0">
                    <Link to="/" style={logoStyle}>
                        <svg
                            width="56"
                            height="56"
                            viewBox="0 0 675 675"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: "18px" }}
                        >
                            <mask id="path-1-inside-1_34_29" fill="white">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M337.5 675C523.896 675 675 523.896 675 337.5C675 151.104 523.896 0 337.5 0C151.104 0 0 151.104 0 337.5C0 523.896 151.104 675 337.5 675ZM429 430V246H337H245V430H429Z"
                                />
                            </mask>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M337.5 675C523.896 675 675 523.896 675 337.5C675 151.104 523.896 0 337.5 0C151.104 0 0 151.104 0 337.5C0 523.896 151.104 675 337.5 675ZM429 430V246H337H245V430H429Z"
                                fill="#529C08"
                            />
                            <path
                                d="M429 246H451V224H429V246ZM429 430V452H451V430H429ZM245 246V224H223V246H245ZM245 430H223V452H245V430ZM653 337.5C653 511.746 511.746 653 337.5 653V697C536.046 697 697 536.046 697 337.5H653ZM337.5 22C511.746 22 653 163.254 653 337.5H697C697 138.954 536.046 -22 337.5 -22V22ZM22 337.5C22 163.254 163.254 22 337.5 22V-22C138.954 -22 -22 138.954 -22 337.5H22ZM337.5 653C163.254 653 22 511.746 22 337.5H-22C-22 536.046 138.954 697 337.5 697V653ZM407 246V430H451V246H407ZM337 268H429V224H337V268ZM245 268H337V224H245V268ZM267 430V246H223V430H267ZM429 408H245V452H429V408Z"
                                fill="#D4AF37"
                                mask="url(#path-1-inside-1_34_29)"
                            />
                        </svg>
                        Ba Sing Scribes
                    </Link>
                </h4>
                {!props.staticEmpty ? headerContent : ""}
            </div>
        </header>
    );
}

export default Header;
