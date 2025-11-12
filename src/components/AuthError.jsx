import { useRef, useEffect } from 'react'
import "../styles/App.css";

export default function AuthError({
  details, setDetails
}) {
  
  const errorRef = useRef(null);
  
  useEffect(() => {
    if (details) {
      errorRef.current.showModal();
    } else {
      errorRef.current.close();
    }
  }, [details]);
  
  function handleOkBtn(e) {
    e.preventDefault();
    setDetails(null);
  }
  console.log("in AuthErrors: ", details);
  return (
    <dialog className="error-dialog" ref={errorRef}>
    <header>
    <h1>Failed to login.</h1>
    </header>
    <ul>
      <li>
        <span>{details.message}</span>
      </li>
    </ul>
    <button type="button" onClick={handleOkBtn}>
    Ok
    </button>
    </dialog>
  );
}