import App from "./components/App";
import ErrorPage from "./components/ErrorPage";
import LandingPage from "./components/LandingPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      }
    ]
  },
];

export default routes;
