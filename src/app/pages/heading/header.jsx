import { Avatar, Link, Spinner } from "@fluentui/react-components";
import "../../../assets/header-styles.scss";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../core/settings/authconfig";
import { callMsGraph } from "../../core/settings/graph";
import { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { accounts, instance } = useMsal();
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });

        const data = await callMsGraph(response.accessToken);
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [accounts, instance]);

  const handleSignOut = (event) => {
    event.preventDefault();
    localStorage.clear();

    instance.logoutRedirect({
      postLogoutRedirectUri: "/signin",
    });
  };

  const handleProfile = () => {
    setIsLoading(true);
    navigate("/profile");
    setIsLoading(false);
  };

  const userName = userData.displayName || "Guest";
  // const handleImage = () => {
  //   window.open("https://ensarsolutions.com/");
  // };

  return (
    <>
      <div className="header">
        {/* <div onClick={handleImage}>
          <img
            src="https://sippio.io/wp-content/uploads/2022/02/sippio-logo.svg"
            alt="#"
            className="image"
          />
        </div> */}
        <div>
          <h2>
            Welcome <span className="h-t-c">SAMPLE -CARRIER PROVIDER COMPANY</span>
          </h2>
        </div>
        <div className="profile">
          <div className="profileContent">
            <div className="icon">
              <Link onClick={handleProfile}>
                <Avatar name={userName} aria-label={userName} />
              </Link>
              <div style={{ marginLeft: "10px" }}>
                <p style={{ margin: "0px" }}>Hi {userName}</p>
                <Link
                  onClick={handleSignOut}
                  style={{ textDecoration: "none" }}
                >
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Header;
