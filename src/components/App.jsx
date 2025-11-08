import "../styles/App.css";
import Navbar from "./Navbar";
import { useState, useEffect, Suspense } from "react";
import { Outlet } from "react-router";
import { CS_API_URL, useAuthorizeToken } from "../util/apiUtils";

function App() {
  // this is the creations showcase user review url. It may change, so maybe place it in .env? //TODO consider the implications
  const CS_CLIENT = "https://creations-showcase-author.vercel.app/";

  const defaultUserValues = {
    email: "",
    firstname: "",
    lastname: "",
    nickname: "",
    password: "",
    "confirm-password": "",
  };

  const [loginFormShown, setLoginFormShown] = useState(false);
  const [signupFormShown, setSignupFormShown] = useState(false);

  const [userDetails, setUserDetails] = useState(defaultUserValues);
  const [validationDetails, setValidationDetails] = useState([]);
  const [authDetails, setAuthDetails] = useState(null);

  const {
    isAuthorized,
    error: authError,
    loading: authLoading,
  } = useAuthorizeToken();

  function handleLoginClick() {
    setLoginFormShown(true);
  }

  function handleSignupClick() {
    setSignupFormShown(true);
  }

  const navProps = {
    handleLoginClick,
    handleSignupClick,
  };

  if (authLoading) {
    return <p>Loading...</p>;
  }
  if (authError) {
    return <ErrorPage />;
  }

  return (
    <>
      <Navbar props={navProps} />
      <main>
        <Outlet context={{ client: CS_CLIENT }} />
        {signupFormShown && (
          <Signup
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            setValidationDetails={setValidationDetails}
            api={CS_API_URL}
            signupFormShown={signupFormShown}
            setSignupFormShown={setSignupFormShown}
            setLoginFormShown={setLoginFormShown}
          />
        )}
        {loginFormShown && (
          <Login
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            setDetails={setAuthDetails}
            api={CS_API_URL}
            loginFormShown={loginFormShown}
            setLoginFormShown={setLoginFormShown}
          />
        )}
        {validationDetails && validationDetails.length > 0 && (
          <ValidationErrors
            details={validationDetails}
            setDetails={setValidationDetails}
            action="sign-up"
          />
        )}
      </main>
    </>
  );
}

export default App;
