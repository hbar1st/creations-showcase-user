import { useOutletContext, Link } from "react-router";
import "../styles/App.css";

function LandingPage() {
  const { client } = useOutletContext();

  return (
    <>
      <h1>Welcome to the Creations Showcase - Review Page!</h1>
      <p>
        Are you ready to review our showcase?{" "}
        <Link to="/showcase">Start here!</Link>
      </p>
      <p>
        Don't forget to sign-up, or log-in if you want to leave comments and
        likes!
      </p>
      <p>
        Wanna showcase your own work? Head over to our sister site:{" "}
        <a href={client}>Creations Showcase - Authors Page!</a>
      </p>
      <p style={{ backgroundColor: "#ab6ff6ab" }}>
        (Note: you won't be registered as an author automatically. You must
        contact hbar1st to become an author after you've signed-up.)
      </p>
    </>
  );
}

export default LandingPage;
