import { useRef, useEffect } from "react";
import "../styles/App.css";

export default function ValidationErrors({ details, setDetails, action }) {
  const errorRef = useRef(null);

  useEffect(() => {
    if (details && details.length > 0) {
      console.log("supposed to show the validation modal now");
      errorRef.current.showModal();
    } else {
      console.log("supposed to close the validation modal");
      errorRef.current.close();
    }
  }, [details]);

  function handleOkBtn(e) {
    e.preventDefault();
    setDetails([]);
  }
  console.log("in ValidationErrors: ", details);
  return (
    <dialog className="error-dialog" ref={errorRef}>
      <header>
        <h1>Failed to complete {action}.</h1>
      </header>
      <ul>
        {details.map((el) => {
          const random_id = crypto.randomUUID();
          return (
            <li id={random_id} key={random_id}>
              <span>
                Issue found with {el.path} {el.type}:
              </span>
              <span> {el.msg}</span>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={handleOkBtn}>
        Ok
      </button>
    </dialog>
  );
}
