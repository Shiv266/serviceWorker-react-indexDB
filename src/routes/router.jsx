import { createBrowserRouter } from "react-router-dom";
import Home from "../component/Home";
import Payment from "../component/Payment";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
]);
