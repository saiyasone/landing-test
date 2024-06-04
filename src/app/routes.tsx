import Landing from "components/presentation/Landing";
import PresentationLayout from "components/presentation/PresentationLayout";
import { RouteObject } from "react-router-dom";
import ContactUs from "./pages/contact-us/ContactUs";
import Home from "./pages/home/Home";

const routes: RouteObject[] = [
  {
    element: <PresentationLayout />,
    children: [
      {
        path: "/",
        element: (
          <Landing>
            <Home />
          </Landing>
        ),
      },
      {
        path: "contact-us",
        element: (
          <Landing>
            <ContactUs />
          </Landing>
        ),
      },
    ],
  },
];

export default routes;
