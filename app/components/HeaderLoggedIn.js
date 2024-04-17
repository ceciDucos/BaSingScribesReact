// import React, { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import DispatchContext from "../DispatchContext";
// import StateContext from "../StateContext";
// import { Tooltip as ReactTooltip } from "react-tooltip";

// function HeaderLoggedIn() {
//     const navigate = useNavigate();
//     const appDispatch = useContext(DispatchContext);
//     const appState = useContext(StateContext);

//     function handleLogout() {
//         appDispatch({ type: "logout" });
//         navigate("/");
//         appDispatch({
//             type: "flashMessages",
//             value: "You have successfully logged out.",
//         });
//     }

//     function handleSearchIcon(e) {
//         e.preventDefault();
//         appDispatch({ type: "openSearch" });
//     }

//     return (
//         <div className="flex-row my-3 my-md-0">
//             <a
//                 onClick={handleSearchIcon}
//                 href="#"
//                 className="text-white mr-2 header-search-icon"
//                 data-tooltip-content="Search"
//                 data-tooltip-id="search"
//             >
//                 <i className="fas fa-search"></i>
//             </a>
//             <ReactTooltip id="search" className="custom-tooltip" />{" "}
//             <span
//                 className={
//                     "mr-2 header-chat-icon " +
//                     (appState.unreadChatCount ? "text-danger" : "text-white")
//                 }
//                 data-tooltip-content="Chat"
//                 data-tooltip-id="chat"
//                 onClick={() => appDispatch({ type: "toggleChat" })}
//             >
//                 <i className="fas fa-comment"></i>
//                 {appState.unreadChatCount ? (
//                     <span className="chat-count-badge text-white">
//                         {appState.unreadChatCount < 10
//                             ? appState.unreadChatCount
//                             : "9+"}
//                     </span>
//                 ) : (
//                     ""
//                 )}
//             </span>
//             <ReactTooltip id="chat" className="custom-tooltip" />{" "}
//             <Link
//                 to={`/profile/${appState.user.username}`}
//                 className="mr-2"
//                 data-tooltip-content="Profile"
//                 data-tooltip-id="profile"
//             >
//                 <img
//                     className="small-header-avatar"
//                     src={appState.user.avatar}
//                 />
//             </Link>
//             <ReactTooltip id="profile" className="custom-tooltip" />{" "}
//             <Link className="btn btn-sm btn-success mr-2" to="/create-post">
//                 Create Post
//             </Link>{" "}
//             <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
//                 Sign Out
//             </button>
//         </div>
//     );
// }

// export default HeaderLoggedIn;

// NO BORRAR ARRIBA QUE LO DE LAS NOTIFICACIONES NO ANDA.

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

    const buttonStyle = {
        backgroundColor: "#487D49",
        color: "#F0E68C",
        border: "none",
        padding: "6px 12px",
        borderRadius: "2px",
        cursor: "pointer",
        fontWeight: "bold",
        flexShrink: 0,
        margin: " 0 1rem",
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
                    <span className="chat-count-badge">
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
            <Link to="/create-post" style={buttonStyle}>
                Create Post
            </Link>
            <button onClick={handleLogout} style={buttonStyle}>
                Sign Out
            </button>
        </div>
    );
}

export default HeaderLoggedIn;
