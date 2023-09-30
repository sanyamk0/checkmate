import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game from "./components/Game/Game"
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/game",
    element: <Game />
  },
  {
    path: "/login",
    element: <Login ></Login>,
  },
  {
    path: "/signup",
    element: <Signup ></Signup>,
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
