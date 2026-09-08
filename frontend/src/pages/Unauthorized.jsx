import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="error-page">
    <div className="error-code">403</div>
    <h1>Access Denied</h1>
    <p>You don&apos;t have permission to view this page.</p>
    <Link to="/" className="btn btn-primary">
      Go Home
    </Link>
  </div>
);

export default Unauthorized;
