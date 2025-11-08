import Burger from "./Burger";
import "../styles/App.css";

function Navbar({ props }) {
  return (
    <>
      <nav>
        <Burger />
        <button type="button" onClick={props.handleLoginClick}>
          Login
        </button>
        <button type="button" onClick={props.handleSignupClick}>
          Sign up!
        </button>
      </nav>
    </>
  );
}

export default Navbar;
