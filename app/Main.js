import React, { useState, useReducer, useEffect, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";
import NotFound from "./components/NotFound";

Axios.defaults.baseURL = process.env.BACKENDURL || "";

// My componentes
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import FlashMesseges from "./components/FlashMessages";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import LoadingDotsIcon from "./components/LoadingDotsIcon";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));

function Main() {
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("complexappToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("complexappToken"),
            username: localStorage.getItem("complexappUsername"),
            avatar: localStorage.getItem("complexappAvatar"),
        },
        isSearchOpen: false,
        isChatOpen: false,
        unreadChatCount: 0,
    };

    function ourReducer(state, action) {
        switch (action.type) {
            case "login": {
                return {
                    ...state,
                    loggedIn: true,
                    user: action.data,
                };
            }
            case "logout": {
                return {
                    ...state,
                    loggedIn: false,
                };
            }
            case "flashMessages": {
                return {
                    ...state,
                    flashMessages: state.flashMessages.concat(action.value),
                };
            }
            case "openSearch": {
                return {
                    ...state,
                    isSearchOpen: true,
                };
            }
            case "closeSearch": {
                return {
                    ...state,
                    isSearchOpen: false,
                };
            }
            case "toggleChat": {
                return {
                    ...state,
                    isChatOpen: !state.isChatOpen,
                };
            }
            case "closeChat": {
                return {
                    ...state,
                    isChatOpen: false,
                };
            }
            case "incrementUnreadChatCount": {
                return {
                    ...state,
                    unreadChatCount: state.unreadChatCount + 1,
                };
            }
            case "clearUnreadChatCount": {
                return {
                    ...state,
                    unreadChatCount: 0,
                };
            }
        }
    }

    const [state, dispatch] = useReducer(ourReducer, initialState);

    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("complexappToken", state.user.token);
            localStorage.setItem("complexappUsername", state.user.username);
            localStorage.setItem("complexappAvatar", state.user.avatar);
        } else {
            localStorage.removeItem("complexappToken");
            localStorage.removeItem("complexappUsername");
            localStorage.removeItem("complexappAvatar");
        }
    }, [state.loggedIn]);

    function addFlashMessage(msg) {
        setFlashMessages((prev) => prev.concat(msg));
    }

    // Check if token has expireed or not on first render
    useEffect(() => {
        if (state.loggedIn) {
            const ourRequest = Axios.CancelToken.source();
            async function fetchResults() {
                try {
                    const response = await Axios.post(
                        "/checkToken",
                        { token: state.user.token },
                        { cancelToken: ourRequest.token }
                    );
                    if (!response.data) {
                        dispatch({ type: "logout" });
                        dispatch({
                            type: "flashMessages",
                            value: "Your session has expired. Please log in again.",
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            fetchResults();
            // If another search was made, and a first one was started, we candel the first one
            // This function will be executed if the element can't be referenced or id the use effect is called more that once.
            return () => ourRequest.cancel();
        }
    }, []);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMesseges messages={state.flashMessages} />
                    <Header />
                    <Suspense fallback={<LoadingDotsIcon />}>
                        <Routes>
                            <Route
                                path="/profile/:username/*"
                                element={<Profile />}
                            />
                            <Route
                                path="/"
                                element={
                                    state.loggedIn ? <Home /> : <HomeGuest />
                                }
                            />
                            <Route path="/about-us" element={<About />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route
                                path="/create-post"
                                element={
                                    <CreatePost
                                        addFlashMessage={addFlashMessage}
                                    />
                                }
                            />
                            <Route
                                path="/post/:id"
                                element={<ViewSinglePost />}
                            />
                            <Route
                                path="/post/:id/edit"
                                element={<EditPost />}
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                    <CSSTransition
                        timeout={330}
                        in={state.isSearchOpen}
                        classNames="search-overlay"
                        unmountOnExit
                    >
                        <div className="search-overlay">
                            <Suspense fallback="">
                                <Search />
                            </Suspense>
                        </div>
                    </CSSTransition>
                    <Suspense>{state.loggedIn && <Chat />}</Suspense>
                    <Footer />
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

ReactDOM.createRoot(document.querySelector("#app")).render(<Main />);

if (module.hot) {
    module.hot.accept();
}
