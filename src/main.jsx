import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./app/core/settings/authconfig.js";
import { Provider } from "react-redux";
import { store } from "./app/store/store";

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <MsalProvider instance={msalInstance}>
        <Provider store={store}>
          <App />
        </Provider>
      </MsalProvider>
    </FluentProvider>
  </React.StrictMode>
);
