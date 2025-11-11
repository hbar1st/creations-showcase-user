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
        errorElement: <ErrorPage />,
      },
      {
        path: "showcase",
        element: <Showcase />,
        errorElement: <ErrorPage />,
      },
      {
        path: "account",
        element: <Account />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/login",
        element: <App />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/error",
        element: <ErrorPage />,
      },
    ],
  },
];

export default routes;
