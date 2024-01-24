import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./app/core/actions/signin";
import Authenticate from "./app/pages/common/authenticate";
import PrivateRoute from "./app/routes/private-router";
import { initializeIcons } from "@fluentui/react/lib/Icons";
initializeIcons();

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route path="*" element={<PrivateRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
