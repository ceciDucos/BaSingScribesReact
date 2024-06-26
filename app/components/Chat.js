import React, { useContext, useEffect, useRef, useState } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { Link } from "react-router-dom";
import io from "socket.io-client";

function Chat() {
    const socket = useRef(null);
    const chatField = useRef(null);
    const chatLog = useRef(null);
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const [state, setState] = useState({
        fieldValue: "",
        chatMessages: [],
    });

    useEffect(() => {
        if (appState.isChatOpen) {
            chatField.current.focus();
            appDispatch({ type: "clearUnreadChatCount" });
        }
    }, [appState.isChatOpen]);

    useEffect(() => {
        socket.current = io(
            process.env.BACKENDURL ||
                "https://mybackendforreactapp-9rq8.onrender.com"
        );
        socket.current.on("chatFromServer", (message) => {
            const messages = state.chatMessages;
            messages.push(message);

            setState({
                chatMessages: [...messages],
                fieldValue: "",
            });
        });

        return () => socket.current.disconnect();
    }, []);

    useEffect(() => {
        chatLog.current.scrollTop = chatLog.current.scrollHeight;
        if (state.chatMessages.length && !appState.isChatOpen) {
            appDispatch({ type: "incrementUnreadChatCount" });
        }
    }, [state.chatMessages]);

    function handleFieldChange(e) {
        const value = e.target.value;
        setState({ ...state, fieldValue: value });
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Send message to chat server
        socket.current.emit("chatFromBrowser", {
            message: state.fieldValue,
            token: appState.user.token,
        });

        const messages = state.chatMessages;
        messages.push({
            message: state.fieldValue,
            username: appState.user.username,
            avatar: appState.user.avatar,
        });
        setState({
            chatMessages: [...messages],
            fieldValue: "",
        });
    }

    return (
        <div
            id="chat-wrapper"
            className={
                "chat-wrapper shadow border-top border-left border-right " +
                (appState.isChatOpen ? "chat-wrapper--is-visible" : "")
            }
        >
            <div className="chat-title-bar">
                Chat
                <span
                    onClick={() => appDispatch({ type: "closeChat" })}
                    className="chat-title-bar-close"
                >
                    <i className="fas fa-times-circle"></i>
                </span>
            </div>
            <div id="chat" className="chat-log" ref={chatLog}>
                {state.chatMessages.map((message, index) => {
                    if (message.username == appState.user.username) {
                        return (
                            <div key={index} className="chat-self">
                                <div className="chat-message">
                                    <div className="chat-message-inner">
                                        {message.message}
                                    </div>
                                </div>
                                <img
                                    className="chat-avatar avatar-tiny"
                                    src={message.avatar}
                                />
                            </div>
                        );
                    }

                    return (
                        <div key={index} className="chat-other">
                            <Link to={`/profile/${message.username}`}>
                                <img
                                    className="avatar-tiny"
                                    src={message.avatar}
                                />
                            </Link>
                            <div className="chat-message">
                                <div className="chat-message-inner">
                                    <Link to={`/profile/${message.username}`}>
                                        <strong>{message.username}: </strong>
                                    </Link>
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <form
                onSubmit={handleSubmit}
                id="chatForm"
                className="chat-form border-top"
            >
                <input
                    ref={chatField}
                    value={state.fieldValue}
                    type="text"
                    className="chat-field"
                    id="chatField"
                    placeholder="Type a message…"
                    autoComplete="off"
                    onChange={handleFieldChange}
                />
            </form>
        </div>
    );
}

export default Chat;
