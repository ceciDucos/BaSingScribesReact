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

    return (
        <div className="flex-row my-3 my-md-0">
            <a
                onClick={handleSearchIcon}
                href="#"
                className="text-white mr-2 header-search-icon"
                data-tooltip-content="Search"
                data-tooltip-id="search"
            >
                <i className="fas fa-search"></i>
            </a>
            <ReactTooltip id="search" className="custom-tooltip" />{" "}
            <span
                className={
                    "mr-2 header-chat-icon " +
                    (appState.unreadChatCount ? "text-danger" : "text-white")
                }
                data-tooltip-content="Chat"
                data-tooltip-id="chat"
                onClick={() => appDispatch({ type: "toggleChat" })}
            >
                <i className="fas fa-comment"></i>
                {appState.unreadChatCount ? (
                    <span className="chat-count-badge text-white">
                        {appState.unreadChatCount < 10
                            ? appState.unreadChatCount
                            : "9+"}
                    </span>
                ) : (
                    ""
                )}
            </span>
            <ReactTooltip id="chat" className="custom-tooltip" />{" "}
            <Link
                to={`/profile/${appState.user.username}`}
                className="mr-2"
                data-tooltip-content="Profile"
                data-tooltip-id="profile"
            >
                <img
                    className="small-header-avatar"
                    src={appState.user.avatar}
                />
            </Link>
            <ReactTooltip id="profile" className="custom-tooltip" />{" "}
            <Link className="btn btn-sm btn-success mr-2" to="/create-post">
                Create Post
            </Link>{" "}
            <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
                Sign Out
            </button>
        </div>
    );
}

export default HeaderLoggedIn;
