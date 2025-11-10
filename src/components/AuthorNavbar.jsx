
import '../styles/App.css'
import Burger from "./Burger";
import { clearToken } from "../util/storage";
import { useNavigate } from "react-router";

function AuthorNavbar({setIsAuthorized}) { //used for authorized users only

  let navigate = useNavigate();

  function handleLogoutClick(e) {
    e.preventDefault();
    clearToken();
    setIsAuthorized(false);
    navigate("/", { state: null, viewTransition: true });
  }

  function handleAccountClick() {
    navigate("/account", { viewTransition: true });
  }

  return (
    <>
      <nav>
        <Burger />
        <button type="button" onClick={handleAccountClick}>
          Account
        </button>
        <button type="button" onClick={handleLogoutClick}>
          Logout
        </button>
      </nav>
    </>
  );
}

export default AuthorNavbar