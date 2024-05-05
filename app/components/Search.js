import React, { useEffect, useContext, useState } from "react";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import Post from "./Post";

function Search() {
    const appDispatch = useContext(DispatchContext);

    const [state, setState] = useState({
        searchTerm: "",
        results: [],
        show: "neither",
        requestCount: 0,
    });

    // Add a listener to close modal on pressing enter
    // Once the elemen is not render anymore, the useEffect return function is run.
    useEffect(() => {
        document.addEventListener("keyup", searchKeyPressHandler);
        return () =>
            document.removeEventListener("keyup", searchKeyPressHandler);
    }, []);

    useEffect(() => {
        if (state.searchTerm.trim()) {
            setState({
                ...state,
                show: "loading",
            });
            const delay = setTimeout(() => {
                setState({
                    ...state,
                    requestCount: state.requestCount + 1,
                });
            }, 330);

            return () => {
                clearTimeout(delay);
            };
        } else {
            setState({
                ...state,
                show: "neither",
            });
        }
    }, [state.searchTerm]);

    useEffect(() => {
        if (state.requestCount) {
            const ourRequest = Axios.CancelToken.source();
            async function fetchResults() {
                try {
                    const response = await Axios.post(
                        "/search",
                        { searchTerm: state.searchTerm },
                        { cancelToken: ourRequest.token }
                    );
                    setState({
                        ...state,
                        results: response.data,
                        show: "results",
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
    }, [state.requestCount]);

    function searchKeyPressHandler(e) {
        // Code for enter key
        if (e.keyCode == 27) {
            appDispatch({ type: "closeSearch" });
        }
    }

    function handleInput(e) {
        const value = e.target.value;
        setState({ ...state, searchTerm: value });
    }

    const searchOverlayBottom = { overflow: "auto" };
    const searchOverlayTop = { backgroundColor: "var(--white-color)" };
    const containerStyle = {
        position: "relative",
        display: "flex",
        alignItems: "center",
        paddingTop: "15px",
        paddingBottom: "15px",
        margin: "75px auto",
        maxWidth: "732px",
    };

    const searchOverlayIcon = {
        color: "var(--blue-color)",
        fontSize: "1.4rem",
        margin: "0",
        marginRight: "10px",
    };

    const liveSearchResults = {
        width: "100%",
        opacity: "0",
        transition: "all 0.3s ease-out",
        transform: "scale(1.07)",
    };

    const liveSearchResultsVisible = {
        ...liveSearchResults,
        opacity: "1",
        transform: "scale(1)",
    };

    const liveSearchField = {
        backgroundColor: "transparent",
        border: "none",
        fontSize: "1.1rem",
        outline: "none",
        flex: "1",
        color: "var(--blue-color)",
    };

    const closeLiveSearchStyle = {
        fontSize: "1.5rem",
        cursor: "pointer",
        opacity: "0.75",
        lineHeight: "1",
        color: "var(--black-color)",
    };

    const circleLoaderStyle = {
        opacity: "0",
        transition: "opacity 0.45s ease-out, visibility 0.45s ease-out",
        visibility: "hidden",
        position: "absolute",
        left: "50%",
        boxSizing: "border-box",
        width: "65px",
        height: "65px",
        borderRadius: "100%",
        border: "10px solid rgba(73, 80, 87, 0.2)",
        borderTopColor: "#495057",
        willChange: "-webkit-transform, transform",
        WebkitTransform: "rotate(0deg)",
        transform: "rotate(0deg)",
        WebkitAnimation: "spin 1s infinite linear",
        animation: "spin 1s infinite linear",
    };

    const circleLoaderVisibleStyle = {
        ...circleLoaderStyle,
        visibility: "visible",
        opacity: "1",
    };

    return (
        <>
            <div style={searchOverlayTop}>
                <div style={containerStyle}>
                    <label
                        htmlFor="live-search-field"
                        style={searchOverlayIcon}
                    >
                        <i className="fas fa-search"></i>
                    </label>
                    <input
                        autoFocus
                        type="text"
                        autoComplete="off"
                        id="live-search-field"
                        style={liveSearchField}
                        placeholder="What are you interested in?"
                        onChange={handleInput}
                    />
                    <span
                        onClick={() => appDispatch({ type: "closeSearch" })}
                        style={closeLiveSearchStyle}
                    >
                        <i className="fas fa-times-circle"></i>
                    </span>
                </div>
            </div>

            <div style={searchOverlayBottom}>
                <div style={containerStyle}>
                    <div
                        style={
                            state.show == "loading"
                                ? circleLoaderVisibleStyle
                                : circleLoaderStyle
                        }
                    ></div>
                    <div
                        style={
                            state.show == "results"
                                ? liveSearchResultsVisible
                                : liveSearchResults
                        }
                    >
                        {state.results.length > 0 ? (
                            <div className="list-group shadow-sm">
                                <div className="list-group-item active">
                                    <strong>Search Results</strong> (
                                    {state.results.length}{" "}
                                    {state.results.length > 1
                                        ? "items"
                                        : "item"}{" "}
                                    found)
                                </div>
                                {state.results.map((post) => {
                                    return (
                                        <Post
                                            post={post}
                                            key={post._id}
                                            onClick={() =>
                                                appDispatch({
                                                    type: "closeSearch",
                                                })
                                            }
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="alert alert-danger text-center shadow-sm">
                                Sorry, we could not find any results for that
                                search.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Search;
