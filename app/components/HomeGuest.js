import React, { useState, useReducer, useEffect, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";
import DispatchContext from "../DispatchContext";

function Home() {
    const appDispatch = useContext(DispatchContext);
    const initialState = {
        username: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: false,
            checkCount: 0,
        },
        email: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: false,
            checkCount: 0,
        },
        password: {
            value: "",
            hasErrors: false,
            message: "",
        },
        submitCount: 0,
    };

    function ourReducer(state, action) {
        let res;
        switch (action.type) {
            case "usernameInmediatly":
                res = {
                    ...state,
                    username: {
                        ...state.username,
                        hasErrors: false,
                        value: action.value,
                    },
                };

                if (action.value.length > 30) {
                    res.username.hasErrors = true;
                    res.username.message =
                        "Username cannot exceed 30 characters.";
                }

                if (action.value && !/^([a-zA-Z0-9]+)$/.test(action.value)) {
                    res.username.hasErrors = true;
                    res.username.message =
                        "Username can only contain letters and numbers.";
                }

                break;
            case "usernameAfterDelay":
                res = {
                    ...state,
                    username: {
                        ...state.username,
                        hasErrors: false,
                    },
                };

                if (state.username.value.length < 3) {
                    res.username.hasErrors = true;
                    res.username.message =
                        "Username must be at least 3 characters.";
                }

                if (!res.username.hasErrors && !action.noRequest) {
                    res.username.checkCount = res.username.checkCount + 1;
                }

                break;
            case "usernameUniqueResults":
                res = {
                    ...state,
                    username: {
                        ...state.username,
                        hasErrors: false,
                    },
                };

                if (action.value) {
                    res.username.hasErrors = true;
                    res.username.isUnique = false;
                    res.username.message = "That username is already taken.";
                } else {
                    res.username.isUnique = true;
                }
                break;
            case "emailInmediatly":
                return {
                    ...state,
                    email: {
                        ...state.email,
                        hasErrors: false,
                        value: action.value,
                    },
                };
            case "emailAfterDelay":
                res = {
                    ...state,
                    email: {
                        ...state.email,
                        hasErrors: false,
                    },
                };

                if (!/^\S+@\S+$/.test(state.email.value)) {
                    res.email.hasErrors = true;
                    res.email.message =
                        "You must provide a valid email address.";
                }

                if (!res.email.hasErrors && !action.noRequest) {
                    res.email.checkCount = res.email.checkCount + 1;
                }

                break;
            case "emailUniqueResults":
                res = {
                    ...state,
                    email: {
                        ...state.email,
                        hasErrors: false,
                    },
                };

                if (action.value) {
                    res.email.hasErrors = true;
                    res.email.isUnique = false;
                    res.email.message = "That email is already taken.";
                } else {
                    res.email.isUnique = true;
                }

                break;
            case "passwordInmediatly":
                res = {
                    ...state,
                    password: {
                        ...state.password,
                        hasErrors: false,
                        value: action.value,
                    },
                };

                if (action.value.length > 50) {
                    res.password.hasErrors = true;
                    res.password.message =
                        "Password cannot exceed 50 characters.";
                }

                break;
            case "passwordAfterDelay":
                res = {
                    ...state,
                    password: {
                        ...state.password,
                        hasErrors: false,
                    },
                };

                if (state.password.value.length < 12) {
                    res.password.hasErrors = true;
                    res.password.message =
                        "Password must be at least 12 characters.";
                }

                if (!res.password.hasErrors) {
                    res.password.checkCount = res.password.checkCount + 1;
                }

                break;
            case "submitForm":
                res = { ...state };
                if (
                    !state.username.hasErrors &&
                    state.username.isUnique &&
                    !state.email.hasErrors &&
                    state.email.isUnique &&
                    !state.password.hasErrors
                ) {
                    res.submitCount = res.submitCount + 1;
                }
                break;
        }
        return res;
    }

    const [state, dispatch] = useReducer(ourReducer, initialState);

    useEffect(() => {
        if (state && state.username.value) {
            const delay = setTimeout(
                () => dispatch({ type: "usernameAfterDelay" }),
                800
            );
            return () => clearTimeout(delay);
        }
    }, [state.username.value]);

    useEffect(() => {
        if (state && state.email.value) {
            const delay = setTimeout(
                () => dispatch({ type: "emailAfterDelay" }),
                800
            );
            return () => clearTimeout(delay);
        }
    }, [state.email.value]);

    useEffect(() => {
        if (state && state.password.value) {
            const delay = setTimeout(
                () => dispatch({ type: "passwordAfterDelay" }),
                800
            );
            return () => clearTimeout(delay);
        }
    }, [state.password.value]);

    useEffect(() => {
        if (state.username.checkCount) {
            const ourRequest = Axios.CancelToken.source();
            async function fetchResults() {
                try {
                    const response = await Axios.post(
                        "/doesUsernameExist",
                        { username: state.username.value },
                        { cancelToken: ourRequest.token }
                    );
                    dispatch({
                        type: "usernameUniqueResults",
                        value: response.data,
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            fetchResults();
            // If another search was made, and a first one was started, we candel the first one
            // This function will be executed if the element can't be referenced or id the use effect is called more that once.
            return () => ourRequest.cancel();
        }
    }, [state.username.checkCount]);

    useEffect(() => {
        if (state.email.checkCount) {
            const ourRequest = Axios.CancelToken.source();
            async function fetchResults() {
                try {
                    const response = await Axios.post(
                        "/doesEmailExist",
                        { email: state.email.value },
                        { cancelToken: ourRequest.token }
                    );
                    dispatch({
                        type: "emailUniqueResults",
                        value: response.data,
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            fetchResults();
            // If another search was made, and a first one was started, we candel the first one
            // This function will be executed if the element can't be referenced or id the use effect is called more that once.
            return () => ourRequest.cancel();
        }
    }, [state.email.checkCount]);

    function handleSubmit(e) {
        e.preventDefault();
        dispatch({ type: "usernameInmediatly", value: state.username.value });
        dispatch({
            type: "usernameAfterDelay",
            value: state.username.value,
            noRequest: true,
        });
        dispatch({ type: "emailInmediatly", value: state.email.value });
        dispatch({
            type: "emailAfterDelay",
            value: state.email.value,
            noRequest: true,
        });
        dispatch({ type: "passwordInmediatly", value: state.password.value });
        dispatch({ type: "passwordAfterDelay", value: state.password.value });
        dispatch({ type: "submitForm" });
    }
    useEffect(() => {
        if (state.submitCount) {
            const ourRequest = Axios.CancelToken.source();
            async function fetchResults() {
                try {
                    const response = await Axios.post(
                        "/register",
                        {
                            username: state.username.value,
                            email: state.email.value,
                            password: state.password.value,
                        },
                        { cancelToken: ourRequest.token }
                    );
                    appDispatch({
                        type: "login",
                        data: response.data,
                    });
                    appDispatch({
                        type: "flashMessages",
                        value: "Congrats! Welcome to your new account.",
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            fetchResults();
            // If another search was made, and a first one was started, we candel the first one
            // This function will be executed if the element can't be referenced or id the use effect is called more that once.
            return () => ourRequest.cancel();
        }
    }, [state.submitCount]);

    return (
        <Page wide={true} title="Welcome!">
            <div className="row align-items-center">
                <div className="col-lg-7 py-3 py-md-5">
                    <h1 className="display-3">Remember Writing?</h1>
                    <p className="lead text-muted">
                        Are you sick of short tweets and impersonal
                        &ldquo;shared&rdquo; posts that are reminiscent of the
                        late 90&rsquo;s email forwards? We believe getting back
                        to actually writing is the key to enjoying the internet
                        again.
                    </p>
                </div>
                <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label
                                htmlFor="username-register"
                                className="text-muted mb-1"
                            >
                                <small>Username</small>
                            </label>
                            <input
                                value={state.username.value}
                                id="username-register"
                                name="username"
                                className="form-control"
                                type="text"
                                placeholder="Pick a username"
                                autoComplete="off"
                                onChange={(e) =>
                                    dispatch({
                                        type: "usernameInmediatly",
                                        value: e.target.value,
                                    })
                                }
                            />
                            <CSSTransition
                                in={state.username.hasErrors}
                                timeout={330}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div className="alert alert-danger small liveValidateMessage">
                                    {state.username.message}
                                </div>
                            </CSSTransition>
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="email-register"
                                className="text-muted mb-1"
                            >
                                <small>Email</small>
                            </label>
                            <input
                                value={state.email.value}
                                id="email-register"
                                name="email"
                                className="form-control"
                                type="text"
                                placeholder="you@example.com"
                                autoComplete="off"
                                onChange={(e) =>
                                    dispatch({
                                        type: "emailInmediatly",
                                        value: e.target.value,
                                    })
                                }
                            />
                            <CSSTransition
                                in={state.email.hasErrors}
                                timeout={330}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div className="alert alert-danger small liveValidateMessage">
                                    {state.email.message}
                                </div>
                            </CSSTransition>
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="password-register"
                                className="text-muted mb-1"
                            >
                                <small>Password</small>
                            </label>
                            <input
                                value={state.password.value}
                                id="password-register"
                                name="password"
                                className="form-control"
                                type="password"
                                placeholder="Create a password"
                                onChange={(e) =>
                                    dispatch({
                                        type: "passwordInmediatly",
                                        value: e.target.value,
                                    })
                                }
                            />
                            <CSSTransition
                                in={state.password.hasErrors}
                                timeout={330}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div className="alert alert-danger small liveValidateMessage">
                                    {state.password.message}
                                </div>
                            </CSSTransition>
                        </div>
                        <button
                            type="submit"
                            className="py-3 mt-4 btn btn-lg btn-success btn-block"
                        >
                            Sign up for ComplexApp
                        </button>
                    </form>
                </div>
            </div>
        </Page>
    );
}

export default Home;
