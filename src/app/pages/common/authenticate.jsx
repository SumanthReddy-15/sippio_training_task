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
    console.log("sigin");
    if (accounts.length === 0) {
      instance.loginRedirect(loginRequest).catcha((e) => {
        console.error(e);
      });
    } else {
      await instance.initialize();
      await instance
        .handleRedirectPromise()
        .then((res) => {
          setdata(res);
          console.log(res);
          localStorage.setItem("loginToken", res?.accessToken)
          if (res) {
            navigate("/");
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
