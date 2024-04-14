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

    return (
        <>
            <div className="search-overlay-top shadow-sm">
                <div className="container container--narrow">
                    <label
                        htmlFor="live-search-field"
                        className="search-overlay-icon"
                    >
                        <i className="fas fa-search"></i>
                    </label>
                    <input
                        autoFocus
                        type="text"
                        autoComplete="off"
                        id="live-search-field"
                        className="live-search-field"
                        placeholder="What are you interested in?"
                        onChange={handleInput}
                    />
                    <span
                        onClick={() => appDispatch({ type: "closeSearch" })}
                        className="close-live-search"
                    >
                        <i className="fas fa-times-circle"></i>
                    </span>
                </div>
            </div>

            <div className="search-overlay-bottom">
                <div className="container container--narrow py-3">
                    <div
                        className={
                            "circle-loader " +
                            (state.show == "loading"
                                ? "circle-loader--visible"
                                : "")
                        }
                    ></div>
                    <div
                        className={
                            "live-search-results " +
                            (state.show == "results"
                                ? "live-search-results--visible"
                                : "")
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
