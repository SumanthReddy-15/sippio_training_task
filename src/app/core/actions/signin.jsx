// import { useEffect } from "react";
import "../../../assets/signin-styles.scss";
import { Button, Card } from "@fluentui/react-components";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../settings/authconfig";
import { useEffect } from "react";

const SignIn = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  console.log(accounts);

  const handleSignIn = async (event) => {
    event.preventDefault();
    await instance.initialize();
    await instance
      .loginRedirect(loginRequest)
      .then((res) => {
        console.log(res);
      })
      .catch(console.error);
  };

  // useEffect(() => {
  //   if (accounts.length > 0) {
  //     navigate("/specialBids");
  //   }
  // }, [accounts, navigate]);

  // useEffect(() => {
  //   if (accounts.length > 0) {
  //     localStorage.setItem("loginToken", accounts?.idToken);
  //     localStorage.setItem("loggedIdToken", accounts[0].idToken);
  //     localStorage.setItem("loggedUserName", accounts.name);
  //     localStorage.setItem("loggedUserEmail", accounts.username);
  //   }
  // }, [accounts, navigate]);
  // useEffect(() => {
  //   if (accounts.length > 0) {
  //     // User is logged in, redirect to a different page
  //     // window.location.href = "/privileges"; // or use your routing logic
  //   } else {
  //     // User is not logged in, redirect to sign-in
  //     instance.loginRedirect(loginRequest).catch(console.error);
  //   }
  // }, [accounts, instance]);

  return (
    <div className="signin-main">
      <Card className="card">
        <div style={{ margin: " 20px 20px" }}>
          <h1 className="signin-heading">ENSAR PORTAL</h1>
          <div className="content">
            <div className="signin-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
                className="ep-signin-icon"
                // style={{ width: "20px", height: "25px" }}
              >
                <path d="M749 403l557 557-557 557-90-90 402-403H0V896h1061L659 493l90-90zM1152 0h512v1920h-512v-128h384V128h-384V0z"></path>
              </svg>
            </div>
            <p className="paragraph">
              Sign in using a Microsoft account to start using the Ensar Portal.
            </p>
          </div>
          <div>
            <Button appearance="primary" onClick={handleSignIn}>
              {" "}
              Sign in
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
