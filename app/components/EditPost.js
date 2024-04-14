import React, { useEffect, useReducer, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";

function EditPost() {
    const navigate = useNavigate();
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const initialState = {
        title: {
            value: "",
            hasErrors: false,
            message: "",
        },
        body: {
            value: "",
            hasErrors: false,
            message: "",
        },
        isFetching: true,
        isSaving: false,
        id: useParams().id,
        sendCount: 0,
        notFound: false,
    };

    const [state, dispatch] = useReducer(ourReducer, initialState);

    function submitHandler(e) {
        e.preventDefault();
        dispatch({
            type: "titleRules",
            value: state.title.value,
        });
        dispatch({
            type: "bodyRules",
            value: state.body.value,
        });
        dispatch({ type: "submitRequest" });
    }

    function ourReducer(state, action) {
        switch (action.type) {
            case "fetchComplete": {
                return {
                    ...state,
                    title: {
                        value: action.value.title,
                        hasErrors: false,
                        message: "",
                    },
                    body: {
                        value: action.value.body,
                        hasErrors: false,
                        message: "",
                    },
                    isFetching: false,
                };
            }
            case "titleChange": {
                return {
                    ...state,
                    title: {
                        value: action.value,
                        hasErrors: false,
                        message: "",
                    },
                };
            }
            case "bodyChange": {
                return {
                    ...state,
                    body: {
                        value: action.value,
                        hasErrors: false,
                        message: "",
                    },
                };
            }
            case "submitRequest": {
                if (!state.title.hasErrors && !state.body.hasErrors) {
                    return {
                        ...state,
                        sendCount: state.sendCount + 1,
                    };
                } else {
                    return { ...state };
                }
            }
            case "saveRequestStarted": {
                return {
                    ...state,
                    isSaving: true,
                };
            }
            case "saveRequestFinished": {
                return {
                    ...state,
                    isSaving: false,
                };
            }
            case "titleRules": {
                if (!action.value.trim()) {
                    return {
                        ...state,
                        title: {
                            value: state.title.value,
                            hasErrors: true,
                            message: "You must provide a value.",
                        },
                    };
                }
                return {
                    ...state,
                };
            }

            case "bodyRules": {
                if (!action.value.trim()) {
                    return {
                        ...state,
                        body: {
                            value: state.body.value,
                            hasErrors: true,
                            message: "You must provide a value.",
                        },
                    };
                }
                return {
                    ...state,
                };
            }
            case "notFound": {
                return {
                    ...state,
                    notFound: true,
                };
            }
        }
    }

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();
        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${state.id}`, {
                    cancelToken: ourRequest.token,
                });
                if (response.data) {
                    dispatch({
                        type: "fetchComplete",
                        value: response.data,
                    });
                    if (
                        appState.user.username != response.data.author.username
                    ) {
                        appDispatch({
                            type: "flashMessages",
                            value: "You don't have permissions to edit this post.",
                        });
                        navigate("/");
                    }
                } else {
                    dispatch({
                        type: "notFound",
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchPost();
        return () => {
            ourRequest.cancel();
        };
    }, []);

    useEffect(() => {
        if (state.sendCount) {
            dispatch({ type: "saveRequestStarted" });
            const ourRequest = Axios.CancelToken.source();
            async function fetchPost() {
                try {
                    await Axios.post(
                        `/post/${state.id}/edit`,
                        {
                            title: state.title.value,
                            body: state.body.value,
                            token: appState.user.token,
                        },
                        {
                            cancelToken: ourRequest.token,
                        }
                    );
                    dispatch({ type: "saveRequestFinished" });
                    appDispatch({
                        type: "flashMessages",
                        value: "Post was updated!",
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            fetchPost();
            return () => {
                ourRequest.cancel();
            };
        }
    }, [state.sendCount]);

    if (state.notFound) {
        return <NotFound />;
    }

    if (state.isFetching) {
        return (
            <Page>
                <LoadingDotsIcon />
            </Page>
        );
    }

    return (
        <Page title="Create new post">
            <Link className="small font-weight-bold" to={`/post/${state.id}`}>
                &laquo; Back to Post
            </Link>
            <form className="mt-3" onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        value={state.title.value}
                        autoFocus
                        name="title"
                        id="post-title"
                        className="form-control form-control-lg form-control-title"
                        type="text"
                        placeholder=""
                        autoComplete="off"
                        onBlur={(e) =>
                            dispatch({
                                type: "titleRules",
                                value: e.target.value,
                            })
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "titleChange",
                                value: e.target.value,
                            })
                        }
                    />
                    {state.title.hasErrors && (
                        <div className="alert alert-danger small liveValidateMessage">
                            {state.title.message}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label
                        htmlFor="post-body"
                        className="text-muted mb-1 d-block"
                    >
                        <small>Body Content</small>
                    </label>
                    <textarea
                        value={state.body.value}
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"
                        type="text"
                        onBlur={(e) =>
                            dispatch({
                                type: "bodyRules",
                                value: e.target.value,
                            })
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "bodyChange",
                                value: e.target.value,
                            })
                        }
                    ></textarea>
                    {state.body.hasErrors && (
                        <div className="alert alert-danger small liveValidateMessage">
                            {state.body.message}
                        </div>
                    )}
                </div>

                <button className="btn btn-primary" disabled={state.isSaving}>
                    {state.isSaving ? "Saving..." : "Save Updates"}
                </button>
            </form>
        </Page>
    );
}

export default EditPost;
