import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useMsal } from "@azure/msal-react";
import "../../assets/table-styles.scss";
import RoutesData from "./routes-data.jsx";
import Sidebar from "../pages/heading/sidebar.jsx";
import Header from "../pages/heading/header.jsx";

export const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { instance } = useMsal();
  const routeConfig = RoutesData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const userTimeOut = async () => {
    setIsAuthenticated(false);
    localStorage.clear();

    instance.logoutRedirect({
      postLogoutRedirectUri: "/signin",
    });
  };

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const isTokenExpired = (token) => {
    if (token) {
      try {
        const decode = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const timeLeft = decode.exp - currentTime;
        return timeLeft >= 0 ? setIsAuthenticated(true) : userTimeOut();
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
        return navigate("/signin");
      }
    } else {
      navigate("/signin");
      localStorage.clear();
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const loggedIdToken = localStorage.getItem("loginToken");
    isTokenExpired(loggedIdToken);
  }, [navigate, isTokenExpired]);

  return (
    <>
      {isAuthenticated && (
        <div className="routesMain">
          <Sidebar />
          <div className="routes">
            <Header />
            <Routes>
              {routeConfig.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivateRoute;
