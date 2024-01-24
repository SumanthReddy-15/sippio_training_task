import { Avatar, Button } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@fluentui/react";
import { loginRequest } from "../settings/authconfig";
import { callMsGraph } from "../settings/graph";
import { useMsal } from "@azure/msal-react";
import { Spinner } from "@fluentui/react-components";
import {
  ArrowLeft24Regular,
  ChevronLeft24Regular,
} from "@fluentui/react-icons";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { instance, accounts } = useMsal();
  const loggedUserName = localStorage.getItem("loggedUserName");
  const handleBack = () => {
    navigate("/");
  };

  const getUserPhoto = async (accessToken) => {
    try {
      const response = await fetch(
        "https://graph.microsoft.com/v1.0/me/photo/$value",
        {
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      );

      if (response.status === 200) {
        const imageBlob = await response.blob();
        return URL.createObjectURL(imageBlob);
      } else {
        console.error("Failed to fetch user photo, status:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch user photo:", error);
      return null;
    }
  };

  useEffect(() => {
    const profileData = async () => {
      setIsLoading(true);
      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });

        const data = await callMsGraph(response.accessToken);

        const photoUrl = await getUserPhoto(response.accessToken);

        setUserData({
          ...data,
          img: photoUrl,
        });

        localStorage.setItem("accessToken", response.accessToken);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    profileData();
  }, [instance, accounts]);

  if (isLoading) {
    return (
      <Spinner label="Loading Profile...." style={{ marginTop: "300px" }} />
    );
  }

  return (
    <div className="table">
      <div className="header-view">
        <Button
          icon={<ArrowLeft24Regular />}
          appearance="transparent"
          style={{ marginLeft: "10px" }}
          onClick={handleBack}
        ></Button>
      </div>
      <hr className="hr" />
      <div style={{ paddingLeft: "15px" }}>
        <div className="profile-header">
          {userData.img ? (
            <img
              src={userData.img}
              alt={userData.givenName}
              className="profile-image"
            />
          ) : (
            <Avatar name={loggedUserName} aria-label="Guest" />
          )}
        </div>
        <div style={{ display: "flex", gap: "50px" }}>
          <div>
            <span>First Name</span>
            <Label>{userData?.givenName} </Label>
          </div>
          <div style={{ marginLeft: "190px" }}>
            <span>Last Name</span>
            <Label>{userData?.surname} </Label>
          </div>
        </div>
        <div style={{ display: "flex", gap: "50px", marginTop: "20px" }}>
          <div>
            <span>Email</span>
            <Label>{userData?.mail} </Label>
          </div>
          <div style={{ marginLeft: "60px" }}>
            <span>Job Role</span>
            <Label>
              {userData?.jobTitle !== null ? userData.jobTitle : "-"}
            </Label>
          </div>
        </div>
        <div style={{ marginTop: "50px" }}>
          <Button
            appearance="primary"
            icon={<ChevronLeft24Regular />}
            onClick={handleBack}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
