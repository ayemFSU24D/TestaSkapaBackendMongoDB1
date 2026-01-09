import { createBrowserRouter } from "react-router-dom"; 

import { Layout } from "./pages/Layout";

import Signup from "./pages/Signup";
import ModelPage from "./ModelPage";
import Contact from "./pages/Contact";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/modelpage",
        element: <ModelPage />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);
