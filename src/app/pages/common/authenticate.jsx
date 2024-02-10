import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../core/settings/authconfig";
import { Spinner } from "@fluentui/react-components";

const Authenticate = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [data, setdata] = useState(null);
  useEffect(() => {
    signin();
    // navigate("/");
  }, [accounts, instance]);

  async function signin() {
    console.log("signin");
    if (accounts.length === 0) {
      instance.loginRedirect(loginRequest).catch((e) => {
        console.error(e);
      });
    } else {
      await instance.initialize();
      await instance
        .handleRedirectPromise()
        .then(async (res) => {
          setdata(res);
          console.log(res);
          await localStorage.setItem("loginToken", res?.accessToken);
          if (res) {
            await navigate("/");
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
    // console.log(instance);
    // navigate("/");
  }

  return (
    <>
      <div className="authentication">
        <Spinner
          label="Loading..."
          size="small"
          style={{ marginTop: "300px" }}
        />
      </div>
      {/* <div>{data}</div> */}
    </>
  );
};

export default Authenticate;
