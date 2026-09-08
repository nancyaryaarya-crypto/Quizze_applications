import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="error-page">
    <div className="error-code">404</div>
    <h1>Page Not Found</h1>
    <p>The page you&apos;re looking for doesn&apos;t exist.</p>
    <Link to="/" className="btn btn-primary">
      Go Home
    </Link>
  </div>
);

export default NotFound;
