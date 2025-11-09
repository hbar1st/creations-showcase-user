import App from "./components/App";
import ErrorPage from "./components/ErrorPage";
import LandingPage from "./components/LandingPage";
import Showcase from "./components/Showcase";

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
      }
    ]
  },
];

export default routes;
