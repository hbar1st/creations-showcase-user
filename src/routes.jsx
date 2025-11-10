import App from "./components/App";
import ErrorPage from "./components/ErrorPage";
import LandingPage from "./components/LandingPage";
import Showcase from "./components/Showcase";
import Account from "./components/Account";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "showcase",
        element: <Showcase />
      },
      {
        path: "account",
        element: <Account />
      },
    ]
  },
];

export default routes;
