import React, { useEffect } from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <Page title="Not Found">
            <div className="text-center">
                <h2>Whoops, we cannot find the page.</h2>
                <p className="lead text-muted">
                    Visit <Link to="/">homepage</Link> page
                </p>
            </div>
        </Page>
    );
}

export default NotFound;
