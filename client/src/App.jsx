import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import SignUpPage from "./pages/SignUpPage";
import Welcome from "./pages/Welcome";
import SummaryPage from "./pages/SummaryPage";
import TodosPage from "./pages/TodosPage";
import ResetPassword from "./pages/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignUpPage />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },

  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/todos/:day",
        element: <TodosPage />,
      },
      {
        path: "/summary",
        element: <SummaryPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router}></RouterProvider>;
}
