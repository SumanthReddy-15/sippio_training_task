import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/styles/error-page-styles.css";

const ErrorPage = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-title">Error 404 - Page Not Found</h1>
        <p className="error-message">
          The page you are looking for does not exist.
        </p>
        <Link to="/signin" className="error-link">
          Go back to the home page
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
