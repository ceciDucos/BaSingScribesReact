import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import { Tooltip as ReactTooltip } from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function ViewSinglePost() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState([]);
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();
        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, {
                    cancelToken: ourRequest.token,
                });
                setPost(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        fetchPost();
        return () => {
            ourRequest.cancel();
        };
    }, [id]);

    if (!isLoading && !post) {
        return <NotFound />;
    }

    if (isLoading) {
        return (
            <Page>
                <LoadingDotsIcon />
            </Page>
        );
    }

    const date = new Date(post.createdDate);
    const dateFormatted = `${
        date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    function isOwner() {
        return (
            appState.loggedIn && post.author.username == appState.user.username
        );
    }

    async function deleteHandler() {
        const areYouSure = window.confirm(
            "Do you really want to delete this post?"
        );
        if (areYouSure) {
            try {
                const response = await Axios.delete(`/post/${id}`, {
                    data: { token: appState.user.token },
                });
                console.log(response.data);
                if (response.data == "Success") {
                    appDispatch({
                        type: "flashMessages",
                        value: "Post was successfully deleted!",
                    });
                    navigate(`/profile/${appState.user.username}`);
                }
            } catch (error) {}
        }
    }

    const deletePostButtonStyle = {
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: "0",
        margin: "0",
    };

    const containerStyle = {
        display: "flex",
        justifyContent: "space-between",
    };

    return (
        <Page title="View post">
            <div style={containerStyle}>
                <h2>{post.title}</h2>
                {isOwner() && (
                    <span className="pt-2">
                        <Link
                            to={`/post/${post._id}/edit`}
                            data-tooltip-content="Edit"
                            data-tooltip-id="edit"
                            className="text-primary mr-2"
                        >
                            <i className="fas fa-edit"></i>
                        </Link>
                        <ReactTooltip id="edit" className="custom-tooltip" />{" "}
                        <a
                            data-tooltip-content="Delete"
                            data-tooltip-id="delete"
                            style={deletePostButtonStyle}
                            className="text-danger"
                            onClick={deleteHandler}
                        >
                            <i className="fas fa-trash"></i>
                        </a>
                        <ReactTooltip id="delete" className="custom-tooltip" />
                    </span>
                )}
            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img className="avatar-tiny" src={post.author.avatar} />
                </Link>
                Posted by{" "}
                <Link to={`/profile/${post.author.username}`}>
                    {post.author.username}
                </Link>{" "}
                on {dateFormatted}
            </p>

            <div className="body-content">
                <ReactMarkdown children={post.body} />
            </div>
        </Page>
    );
}

export default ViewSinglePost;
