import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { Tooltip as ReactTooltip } from "react-tooltip";

function HeaderLoggedIn() {
    const navigate = useNavigate();
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);

    function handleLogout() {
        appDispatch({ type: "logout" });
        navigate("/");
        appDispatch({
            type: "flashMessages",
            value: "You have successfully logged out.",
        });
    }

    function handleSearchIcon(e) {
        e.preventDefault();
        appDispatch({ type: "openSearch" });
    }

    const headerStyles = {
        display: "flex",
        alignItems: "center",
        color: "#F0E68C",
        padding: "0.5rem",
        borderRadius: "4px",
    };

    const iconStyles = {
        color: "#F0E68C",
        cursor: "pointer",
        margin: "0 1rem",
    };

    const avatarStyle = {
        display: "inline-block",
        verticalAlign: "middle",
        border: "2px solid #6E8B3D",
        borderRadius: "50%",
        margin: " 0 1rem",
        maxHeight: "48px",
    };

    const chatCountBadge = {
        textAlign: "center",
        position: "absolute",
        top: "2px",
        left: "0",
        width: "16px",
        fontSize: "0.6rem",
        fontWeight: "bold",
    };

    return (
        <div style={headerStyles}>
            <a
                onClick={handleSearchIcon}
                style={iconStyles}
                data-tooltip-content="Search"
                data-tooltip-id="search"
            >
                <i className="fas fa-search"></i>
            </a>
            <ReactTooltip id="search" className="custom-tooltip" />
            <span
                className={appState.unreadChatCount ? "text-danger" : ""}
                data-tooltip-content="Chat"
                data-tooltip-id="chat"
                onClick={() => appDispatch({ type: "toggleChat" })}
                style={iconStyles}
            >
                <i className="fas fa-comment"></i>
                {appState.unreadChatCount ? (
                    <span style={chatCountBadge}>
                        {appState.unreadChatCount < 10
                            ? appState.unreadChatCount
                            : "9+"}
                    </span>
                ) : (
                    ""
                )}
            </span>
            <ReactTooltip id="chat" className="custom-tooltip" />
            <Link
                to={`/profile/${appState.user.username}`}
                data-tooltip-content="Profile"
                data-tooltip-id="profile"
            >
                <img
                    src={appState.user.avatar}
                    alt={`${appState.user.username}'s avatar`}
                    style={avatarStyle}
                />
            </Link>
            <ReactTooltip id="profile" className="custom-tooltip" />
            <Link to="/create-post" className="app-btn phantom">
                Create Post
            </Link>
            <button onClick={handleLogout} className="app-btn link">
                Sign Out
            </button>
        </div>
    );
}

export default HeaderLoggedIn;
