import { useRouteError } from "react-router";
import { Link } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Link to="/">
        You can go back to the home page by clicking here, though!
      </Link>
      <p>{error.timestamp ?? new Date().toUTCString()}</p>
      <p>
        Error Message: <i>{error.message || error.statusText}</i>
      </p>
    </div>
  );
}
