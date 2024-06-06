import PageLayout from "components/PageLayout";
import IsLoggedClientAuthGuard from "components/guard/IsLoggedClientAuthGuard";
import Landing from "components/presentation/Landing";
import PresentationLayout from "components/presentation/PresentationLayout";
import { AuthProvider } from "contexts/AuthProvider";
import { RouteObject } from "react-router-dom";
import ContactUs from "./pages/contact-us/ContactUs";
import Feedback from "./pages/feedback/FeedBack";
import FileDrop from "./pages/file-drop/FileDrop";
import Home from "./pages/home/Home";
import PricingPlan from "./pages/pricing-plan/PricingPlan";
import PrivacyPolicy from "./pages/privacy-and-policy/PrivacyPolicy";
import SignIn from "./pages/sign-in/SignIn";
import SignUp from "./pages/sign-up/SignUp";
import TermCondition from "./pages/term-and-condition/TermCondition";

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
        path: "terms-conditions",
        element: (
          <Landing>
            <TermCondition />
          </Landing>
        ),
      },
      {
        path: "privacy-policy",
        element: (
          <Landing>
            <PrivacyPolicy />
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
      {
        path: "pricing-plans",
        element: (
          <Landing>
            <PricingPlan />
          </Landing>
        ),
      },

      {
        path: "feedback",
        element: (
          <Landing>
            <Feedback />
          </Landing>
        ),
      },
      {
        path: "filedrops",
        element: (
          <Landing>
            <FileDrop />
          </Landing>
        ),
      },
    ],
  },
  {
    path: "auth",
    element: <AuthProvider></AuthProvider>,
    children: [
      {
        element: <PageLayout />,
        children: [
          {
            path: "sign-in",
            element: (
              <IsLoggedClientAuthGuard>
                <SignIn />
              </IsLoggedClientAuthGuard>
            ),
          },
          {
            path: "sign-up",
            element: <SignUp />,
          },
        ],
      },
    ],
  },
];

export default routes;
