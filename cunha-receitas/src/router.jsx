import { createBrowserRouter } from "react-router-dom";
import { Home } from "./Home";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { RootLayout } from "./RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
]);

export default router;
