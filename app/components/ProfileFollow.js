import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";

function ProfileFollow(props) {
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [elements, setElements] = useState([]);
    const [msg, setMsg] = useState("");
    const appState = useContext(StateContext);

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();
        setIsLoading(true);
        async function fetchData() {
            try {
                const response = await Axios.get(
                    `/profile/${username}/${props.keyValue}`,
                    {
                        cancelToken: ourRequest.token,
                    }
                );
                setElements(response.data);
                setIsLoading(false);
                handleEmptyMsg();
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
        return () => {
            ourRequest.cancel();
        };
    }, [username, props.keyValue]);

    function handleEmptyMsg() {
        if (username == appState.user.username) {
            setMsg(
                props.keyValue == "followers"
                    ? "You don't have any followers yet. "
                    : "You are not following anyone yet."
            );
        } else {
            setMsg(
                props.keyValue == "followers"
                    ? "This user has not got any follwers yet. "
                    : "This user is not following anyone yet."
            );
        }
    }

    if (isLoading) return <LoadingDotsIcon />;

    return (
        <div className="list-group">
            {elements.map((follower, index) => {
                return (
                    <Link
                        key={index}
                        to={`/profile/${follower.username}`}
                        className="list-group-item list-group-item-action"
                    >
                        <img className="avatar-tiny" src={follower.avatar} />{" "}
                        {follower.username}
                    </Link>
                );
            })}

            {!elements.length ? (
                <p className="text-center text-muted">{msg}</p>
            ) : (
                ""
            )}
        </div>
    );
}

export default ProfileFollow;
