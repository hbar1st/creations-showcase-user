import { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";
import "../styles/App.css";
import burgerIcon from "../assets/hamburger_menu.svg";

function Burger() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    // Define the event handler function
    let openTheMenu = menuRef.current.hasAttribute("open");
    const handleClickAnywhere = (event) => {
      console.log(
        "trying to handle a click on ",
        event.target,
        menuRef.current
      );
      if (menuOpen) {
        if (menuRef && !burgerRef.current.contains(event.target)) {
          console.log("menu ref is: ", menuRef);
          if (
            !menuRef.current.contains(event.target) ||
            event.target == menuRef.current
          ) {
            console.log("someone clicked out side the menu?", event.target);
            setMenuOpen(false);
            openTheMenu = false;
            menuRef.current.close();
          }
          if (menuRef.current.contains(event.target)) {
            setMenuOpen(false);
            openTheMenu = false;
            menuRef.current.close();
          }
        }
      }
    };

    if (openTheMenu) document.addEventListener("click", handleClickAnywhere);

    // Return a cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickAnywhere);
    };
  }, [menuOpen]);

  function handleClick(e) {
    e.preventDefault();
    // Fallback for browsers that don't support this API:
    if (!document.startViewTransition) {
      showMenu();
      return;
    }

    // With a View Transition:
    document.startViewTransition(() => showMenu());

    function showMenu() {
      console.log("what is menuOpen's value? ", menuOpen, menuRef.current);
      if (!menuOpen) {
        console.log(
          "the dialog ought to be shown now and menuOpen will become true"
        );
        setMenuOpen(true);
        menuRef?.current.showModal();
      } else {
        console.log("menuOpen is true but will become false");
        setMenuOpen(false);
        menuRef?.current.close();
      }
    }
  }

  return (
    <>
      <button type="button" onClick={handleClick} ref={burgerRef}>
        <img src={burgerIcon} alt="menu" />
      </button>
      <dialog ref={menuRef} className="burger-menu">
        <ul>
          <li>
            <Link to="/showcase">Showcase</Link>
          </li>

          <li>
            <Link to="/account">Account</Link>
          </li>

          <li>
            <Link to="https://creations-showcase-author.vercel.app/">
              Authors Page
            </Link>
          </li>
        </ul>
      </dialog>
    </>
  );
}

export default Burger;
