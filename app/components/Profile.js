import React, { useEffect, useContext, useState } from "react";
import Page from "./Page";
import { useParams, NavLink, Route, Routes } from "react-router-dom";
import Axios from "axios";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import ProfileFollow from "./ProfileFollow";
import LoadingDotsIcon from "./LoadingDotsIcon";

function Profile() {
    const { username } = useParams();

    const appState = useContext(StateContext);

    const [state, setState] = useState({
        isLoading: true,
        followActionLoading: false,
        startFollowingRequestCount: 0,
        stopFollowingRequestCount: 0,
        profileData: {
            profileUsername: "",
            profileAvatar: "",
            isFollowing: true,
            counts: { postCount: "0", followerCount: "0", followingCount: "0" },
        },
    });

    useEffect(() => {
        setState({
            ...state,
            isLoading: true,
        });
        async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, {
                    token: appState.user.token,
                });
                setState({
                    ...state,
                    profileData: response.data,
                    isLoading: false,
                });
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [username]);

    function startFollowing() {
        setState({
            ...state,
            startFollowingRequestCount: state.startFollowingRequestCount + 1,
        });
    }

    function stopFollowing() {
        setState({
            ...state,
            stopFollowingRequestCount: state.stopFollowingRequestCount + 1,
        });
    }

    useEffect(() => {
        if (state.startFollowingRequestCount > 0) {
            setState({
                ...state,
                followActionLoading: true,
            });
            async function fetchData() {
                try {
                    await Axios.post(
                        `/addFollow/${state.profileData.profileUsername}`,
                        {
                            token: appState.user.token,
                        }
                    );
                    setState({
                        ...state,
                        profileData: {
                            ...state.profileData,
                            isFollowing: true,
                            counts: {
                                ...state.profileData.counts,
                                followerCount:
                                    state.profileData.counts.followerCount + 1,
                            },
                        },
                        followActionLoading: false,
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData();
        }
    }, [state.startFollowingRequestCount]);

    useEffect(() => {
        if (state.stopFollowingRequestCount > 0) {
            setState({
                ...state,
                followActionLoading: true,
            });
            async function fetchData() {
                try {
                    await Axios.post(
                        `/removeFollow/${state.profileData.profileUsername}`,
                        {
                            token: appState.user.token,
                        }
                    );
                    setState({
                        ...state,
                        profileData: {
                            ...state.profileData,
                            isFollowing: false,
                            counts: {
                                ...state.profileData.counts,
                                followerCount:
                                    state.profileData.counts.followerCount - 1,
                            },
                        },
                        followActionLoading: false,
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData();
        }
    }, [state.stopFollowingRequestCount]);

    if (state.isLoading) return <LoadingDotsIcon />;

    const avatarStyle = {
        width: "32px",
        height: "32px",
        borderRadius: "16px",
        marginRight: "5px",
        position: "relative",
        top: "-3px",
    };

    return (
        <Page title="Profile Screen">
            <h2>
                <img
                    style={avatarStyle}
                    src={state.profileData.profileAvatar}
                />{" "}
                {state.profileData.profileUsername}
                {appState.loggedIn &&
                    !state.profileData.isFollowing &&
                    state.profileData.profileUsername !=
                        appState.user.username && (
                        <button
                            onClick={startFollowing}
                            disabled={state.followActionLoading}
                            className="btn btn-primary btn-sm ml-2"
                        >
                            Follow <i className="fas fa-user-plus"></i>
                        </button>
                    )}
                {appState.loggedIn &&
                    state.profileData.isFollowing &&
                    state.profileData.profileUsername !=
                        appState.user.username && (
                        <button
                            onClick={stopFollowing}
                            disabled={state.followActionLoading}
                            className="btn btn-danger btn-sm ml-2"
                        >
                            Stop Following <i className="fas fa-user-times"></i>
                        </button>
                    )}
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <NavLink to="" end className="nav-item nav-link">
                    Posts: {state.profileData.counts.postCount}
                </NavLink>
                <NavLink to="followers" className="nav-item nav-link">
                    Followers: {state.profileData.counts.followerCount}
                </NavLink>
                <NavLink to="following" className="nav-item nav-link">
                    Following: {state.profileData.counts.followingCount}
                </NavLink>
            </div>

            <Routes>
                <Route path="" element={<ProfilePosts />}></Route>
                <Route
                    path="followers"
                    element={<ProfileFollow keyValue="followers" />}
                ></Route>
                <Route
                    path="following"
                    element={<ProfileFollow keyValue="following" />}
                ></Route>
            </Routes>
            {/* <ProfilePosts /> */}
        </Page>
    );
}

export default Profile;
