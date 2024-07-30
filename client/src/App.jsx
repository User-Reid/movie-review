import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import RatedList from "./pages/RatedList";
import FavoritesList from "./pages/FavoritesList";
import Error from "./components/Error";
import Dashboard2 from "./pages/Dashboard2";
import auth from "./utils/auth";
import "../index.css";
// import Dashboard from "./pages/Dashboard";

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      errorElement: <Error />,

      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/",
          element: auth.loggedIn() ? <Dashboard2 /> : <Login />,
        },
        {
          path: "/rated",
          element: auth.loggedIn() ? <RatedList /> : <Login />,
        },
        {
          path: "/favorites",
          element: auth.loggedIn() ? <FavoritesList /> : <Login />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
