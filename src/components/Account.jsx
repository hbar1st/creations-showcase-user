import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import ValidationErrors from "./ValidationErrors.jsx";
import styles from "../styles/Account.module.css";
import { useGetAPI, callAPI } from "../util/apiUtils";

export default function Account() {
  const { data: userProfile } = useGetAPI("/user");
  const [successPopupShown, setSuccessPopupShown] = useState(false);
  const [progressShown, setProgressShown] = useState(false);
  const [validationDetails, setValidationDetails] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [userDetails, setUserDetails] = useState({
    email: null,
    firstname: null,
    lastname: null,
    nickname: null,
    password: "",
    "confirm-password": "",
  });

  const successRef = useRef(null);
  const progressRef = useRef(null);
  const updateRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    if (!progressShown && progressRef) {
      progressRef.current?.close();
    } else {
      progressRef.current?.showModal();
    }
  }, [progressShown]);

  useEffect(() => {
    if (!successPopupShown && successRef) {
      successRef.current?.close();
    } else {
      successRef.current?.showModal();
    }
  }, [successPopupShown]);

  /**
   * this function will react to user typing in the fields and change the requirements for the passwords fields if the user types in them
   * @param {*} type
   * @param {*} value
   */
  function handleChange(type, value) {
    if (type === "password" && value) {
      confirmPasswordRef.current.setAttribute("required", "");
    }
    if (type === "confirm-password" && value) {
      passwordRef.current.setAttribute("required", "");
    }
    if (type === "password" && value === "") {
      confirmPasswordRef.current.removeAttribute("required");
    }
    if (type === "confirm-password" && value === "") {
      passwordRef.current.removeAttribute("required");
    }
    const newUser = { ...userDetails, [type]: value };
    setUserDetails(newUser);
  }

  function handleOkBtn(e) {
    e.preventDefault();
    setSuccessPopupShown(false);
  }

  async function handleDeleteClick(e) {
    e.preventDefault();
    
    if (updateRef.current.hasAttribute("data-triggered")) {
      return;
    }
    try {
      updateRef.current.setAttribute("data-triggered", "true"); // try to stop listening to multiple button clicks
      setProgressShown(true);
      const res = await callAPI("DELETE", "/user");

      if (res && res.statusCode === 401) {
        navigate(res.navigate, { state: location.pathname,  viewTransition: true })
      }

      if (res && res.statusCode !== 400) {
        console.log(
          "result came back ok for account delete: ",
          res
        );
        navigate("/", { state: null , viewTransition: true });
      } else {
        // show these errors somewhere
        console.log(
          "result came back with errors? for account delete: ",
          res
        );
        setValidationDetails(res.details);
      }
    } catch (error) {
      console.log(error, error.stack);
      throw new Error(error.message);
    } finally {
      setProgressShown(false);
      updateRef.current.removeAttribute("data-triggered");
    }
  }


  async function updateAccount(formData) {
    if (updateRef.current.hasAttribute("data-triggered")) {
      return;
    }
    try {
      updateRef.current.setAttribute("data-triggered", "true"); // try to stop listening to multiple button clicks
      setProgressShown(true);
      if (formData.get('password') == "" && formData.get('confirm-password') == "") {
        console.log("delete the password keys")
        formData.delete('password');
        formData.delete('confirm-password');
      }
      const updateUserProfile = await callAPI("PUT", "/user", formData);

      if (updateUserProfile && updateUserProfile.status === 401) {
        navigate(updateUserProfile.route, { state: location.pathname, viewTransition: true });
      }

      if (updateUserProfile && updateUserProfile.statusCode !== 400) {
        console.log(
          "result came back ok for account update: ",
          updateUserProfile
        );
        setSuccessPopupShown(true);
      } else {
        // show these errors somewhere
        console.log(
          "result came back with errors? for account update: ",
          updateUserProfile
        );
        setValidationDetails(updateUserProfile.details);
      }
    } catch (error) {
      console.log(error, error.stack);
      throw new Error(error.message);
    } finally {
      setProgressShown(false);
      updateRef.current.removeAttribute("data-triggered");
    }
  }

  if (userProfile) {
    return (
      <main className={styles.accountMain}>
        <h1 className={styles.accountHeading}>Manage your account:</h1>

        {validationDetails && validationDetails.length > 0 && (
          <ValidationErrors
            details={validationDetails}
            setDetails={setValidationDetails}
            action="account update"
          />
        )}
        <form action={updateAccount} ref={updateRef}>
          <div>
            <label className="authLabel" htmlFor="firstname">
              Firstname:{" "}
            </label>
            <input
              value={userDetails.firstname ?? userProfile.user.firstname}
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
              value={userDetails.lastname ?? userProfile.user.lastname}
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
              value={userDetails.nickname ?? userProfile.user.nickname}
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
              value={userDetails.email ?? userProfile.user.email}
              required
              onChange={(event) => handleChange("email", event.target.value)}
            />
            <label className="authLabel" htmlFor="password">
              Password:{" "}
            </label>
            <input
              ref={passwordRef}
              value={userDetails.password}
              onChange={(event) => handleChange("password", event.target.value)}
              type="password"
              name="password"
              id="password"
              minLength="8"
              className="auth"
            />
            <label className="authLabel" htmlFor="password">
              Confirm Password:{" "}
            </label>
            <input
              ref={confirmPasswordRef}
              value={userDetails["confirm-password"]}
              onChange={(event) =>
                handleChange("confirm-password", event.target.value)
              }
              type="password"
              name="confirm-password"
              id="confirm-password"
              minLength="8"
              className="auth"
            />
            <div className="button-panel">
              <button type="button" onClick={handleDeleteClick}>
                Delete Account
              </button>
              <button type="submit">Save</button>
            </div>
          </div>
        </form>
        <dialog className="progress-dialog" ref={progressRef}>
          <header>
            <p>Please wait.</p>
          </header>
          <progress value={null} />
        </dialog>
        <dialog className="progress-dialog" ref={successRef}>
          <header>
            <p>Account updated.</p>
          </header>{" "}
          <button type="button" onClick={handleOkBtn}>
            Ok
          </button>
        </dialog>
      </main>
    );
  } else {
    return <div>Loading...</div>;
  }
}
