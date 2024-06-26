import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Page from "./Page";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreatePost() {
    const [title, setTitle] = useState();
    const [body, setBody] = useState();
    const navigate = useNavigate();
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await Axios.post("/create-post", {
                title,
                body,
                token: appState.user.token,
            });

            appDispatch({
                type: "flashMessages",
                value: "Congrats, post created!!!!!!",
            });
            navigate(`/post/${response.data}`);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Page title="Create new post">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        value={title}
                        autoFocus
                        name="title"
                        id="post-title"
                        className="form-control form-control-lg form-control-title"
                        type="text"
                        placeholder=""
                        autoComplete="off"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label
                        htmlFor="post-body"
                        className="text-muted mb-1 d-block"
                    >
                        <small>Body Content</small>
                    </label>
                    <textarea
                        value={body}
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"
                        type="text"
                        onChange={(e) => setBody(e.target.value)}
                    ></textarea>
                </div>

                <button className="app-btn primary">Save New Post</button>
            </form>
        </Page>
    );
}

export default CreatePost;
