import "../styles/App.css";
import { setToken } from "../util/storage";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";

function Login({
  userDetails,
  setUserDetails,
  setDetails,
  setIsAuthorized,
  api,
  loginFormShown,
  setLoginFormShown,
}) {
  const loginRef = useRef(null);
  const progressRef = useRef(null);

  const [progressShown, setProgressShown] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (progressShown) {
      progressRef.current.showModal();
    } else {
      progressRef.current.close();
    }
  }, [progressShown]);

  useEffect(() => {
    if (loginFormShown) {
      loginRef.current.showModal();
    } else {
      loginRef.current.close();
    }
  }, [loginFormShown]);

  useEffect(() => {
    if (error) {
      navigate("/error", {
        state: error,
        viewTransition: true,
      });
    }
  });

  function handleChange(type, value) {
    const newUser = { ...userDetails, [type]: value };
    setUserDetails(newUser);
  }

  function handleCancelBtn(e) {
    e.preventDefault();
    setLoginFormShown(false);
    setDetails(null);
  }

  async function login(formData) {
    try {
      setProgressShown(true);
      setLoginFormShown(false);
      const res = await fetch(`${api}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData),
      });

      setProgressShown(false);
      if (res.status === 404) {
        console.log("In Login component and failing to authorize.");
        throw new Response("API Not Found", { status: 404 });
      }
      if (res.ok) {
        // get the data which contains the userid
        const data = await res.json();
        setIsAuthorized(data.userid)
        console.log("In Login component, res status is: ", res.status);
        const token = res.headers.get("Authorization").split(" ")[1];
        // grab the jwt token and store it!
        setToken(token);
        // todo show the showcase page
        navigate(location.state ?? "/showcase", {
          state: null,
          viewTransition: true,
        });
      } else {
        // show these errors somewhere
        const data = await res.json();
        console.log("found errors during login: ", data);
        setDetails(data);
      }
    } catch (error) {
      console.log(error, error.stack);
      console.log("caught an error from calling fetch inside of Login");
      setError(error);
    }
  }

  return (
    <>
      <dialog ref={loginRef}>
        <form action={login}>
          <div>
            <h2>Login</h2>
            <label htmlFor="email" className="authLabel">
              Email:{" "}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="auth"
              value={userDetails.email}
              required
              onChange={(event) => handleChange("email", event.target.value)}
            />
            <label className="authLabel" htmlFor="password">
              Password:{" "}
            </label>
            <input
              value={userDetails.password}
              onChange={(event) => handleChange("password", event.target.value)}
              type="password"
              name="password"
              id="password"
              required
              minLength="8"
              className="auth"
            />
            <div className="button-panel">
              <button id="cancel" type="reset" onClick={handleCancelBtn}>
                Cancel
              </button>
              <button type="submit">Submit</button>
            </div>
          </div>
        </form>
      </dialog>
      <dialog className="progress-dialog" ref={progressRef}>
        <header>
          <p>Please wait.</p>
        </header>
        <progress value={null} />
      </dialog>
    </>
  );
}

export default Login;
