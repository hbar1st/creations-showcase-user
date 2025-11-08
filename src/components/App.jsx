import "../styles/App.css";

function App() {
  // this is the creations showcase user review url. It may change, so maybe place it in .env? //TODO consider the implications
  const CS_CLIENT = "https://creations-showcase-author.vercel.app/";

  return (
    <>
      <main>
        <h1>Welcome to the Creations Showcase - Review Page!</h1>
        <p>Are you ready to review our showcase? Start here!</p>
        <p>
          Don't forget to sign-up, or log-in if you want to leave comments and
          likes!
        </p>
        <p>
          Wanna showcase your own work? Head over to our sister site:{" "}
          <a href={CS_CLIENT}>Creations Showcase - Authors Page!</a>
        </p>
        <p style={{ backgroundColor: "#ab6ff6ab" }}>
          (Note: you won't be registered as an author automatically. You must
          contact hbar1st to become an author after you've signed-up.)
        </p>
      </main>
    </>
  );
}

export default App;
