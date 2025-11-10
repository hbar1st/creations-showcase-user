import "../styles/App.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

function Signup({
  userDetails,
  setValidationDetails,
  setUserDetails,
  api,
  signupFormShown,
  setSignupFormShown,
  setLoginFormShown,
}) {
  const signupRef = useRef(null);
  const progressRef = useRef(null);

  const [progressShown, setProgressShown] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

    useEffect(() => {
      if (error) {
        navigate("/error", {
          state: error,
          viewTransition: true,
        });
      }
    });
  
  useEffect(() => {
    if (signupFormShown) {
      signupRef.current.showModal();
    } else {
      signupRef.current.close();
      if (progressShown) {
        progressRef.current.showModal();
      }
    }
    if (!progressShown) {
      progressRef.current.close();
    }
  }, [signupFormShown, progressShown]);

  function handleChange(type, value) {
    const newUser = { ...userDetails, [type]: value };
    setUserDetails(newUser);
  }

  function handleCancelBtn(e) {
    e.preventDefault();
    setSignupFormShown(false);
    setValidationDetails([]);
  }

  async function signUp(formData) {
    if (signupRef.current.hasAttribute("data-triggered")) {
      return;
    }
    try {
      signupRef.current.setAttribute("data-triggered", "true"); // try to stop listening to multiple button clicks
      setProgressShown(true);
      setSignupFormShown(false);
      const res = await fetch(`${api}/user/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData),
      });

      setProgressShown(false);
      if (res.status === 404) {
        throw new Response("API Not Found", { status: 404 });
      }
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        // todo show the login page
        setLoginFormShown(true);
      } else {
        // show these errors somewhere
        const data = await res.json();
        console.log(data);
        setValidationDetails(data.details);
      }
    } catch (error) {
      console.log(error, error.stack);
      console.log("caught an error from calling fetch inside of Signup");
      setError(error);
    } finally {
      signupRef.current.removeAttribute("data-triggered");
    }
  }

  return (
    <>
      <dialog ref={signupRef}>
        <form action={signUp}>
          <div>
            <h2>Author Sign Up Form</h2>
            <label className="authLabel" htmlFor="firstname">
              Firstname:{" "}
            </label>
            <input
              value={userDetails.firstname}
              onChange={(event) =>
                handleChange("firstname", event.target.value)
              }
              type="text"
              name="firstname"
              id="firstname"
              required
              maxLength="25"
              minLength="1"
              className="auth"
            />
            <label className="authLabel" htmlFor="lastname">
              Lastname:{" "}
            </label>
            <input
              value={userDetails.lastname}
              onChange={(event) => handleChange("lastname", event.target.value)}
              type="text"
              name="lastname"
              id="lastname"
              required
              maxLength="50"
              minLength="1"
              className="auth"
            />
            <label className="authLabel" htmlFor="nickname">
              Nickname:{" "}
            </label>
            <input
              value={userDetails.nickname}
              onChange={(event) => handleChange("nickname", event.target.value)}
              type="text"
              name="nickname"
              id="nickname"
              required
              maxLength="25"
              minLength="1"
              className="auth"
            />
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
            <label className="authLabel" htmlFor="password">
              Confirm Password:{" "}
            </label>
            <input
              value={userDetails["confirm-password"]}
              onChange={(event) =>
                handleChange("confirm-password", event.target.value)
              }
              type="password"
              name="confirm-password"
              id="confirm-password"
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

export default Signup;
