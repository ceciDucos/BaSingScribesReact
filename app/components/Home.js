import React, { useEffect, useContext, useState } from "react";
import Page from "./Page";
import StateContext from "../StateContext";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Axios from "axios";
import Post from "./Post";

function Home() {
    const appState = useContext(StateContext);
    const [state, setState] = useState({
        isLoading: true,
        feed: [],
    });

    useEffect(() => {
        setState({
            ...state,
            isLoading: true,
        });
        async function fetchData() {
            try {
                const response = await Axios.post("/getHomeFeed", {
                    token: appState.user.token,
                });
                setState({
                    isLoading: false,
                    feed: response.data,
                });
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    if (state.isLoading) {
        return <LoadingDotsIcon />;
    }

    return (
        <Page title="Your feed">
            {state.feed.length > 0 ? (
                <>
                    <h2 className="text-center mb-4">
                        The Latest From Those You Follow
                    </h2>
                    <div className="list-group">
                        {state.feed.map((post) => {
                            return <Post post={post} key={post._id} />;
                        })}
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-center">
                        Hello <strong>{appState.user.username}</strong>, your
                        feed is empty.
                    </h2>
                    <p className="lead text-muted text-center">
                        Your feed displays the latest posts from the people you
                        follow. If you don&rsquo;t have any friends to follow
                        that&rsquo;s okay; you can use the &ldquo;Search&rdquo;
                        feature in the top menu bar to find content written by
                        people with similar interests and then follow them.
                    </p>
                </>
            )}
        </Page>
    );
}

export default Home;
