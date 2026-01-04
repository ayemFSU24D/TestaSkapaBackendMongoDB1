import { createBrowserRouter } from "react-router-dom"; 
import Home from "./pages/Home";
import { Layout } from "./pages/Layout";
import { Contact } from "./pages/Contact";
import Signup from "./pages/Signup";
import ModelPage from "./ModelPage";

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
