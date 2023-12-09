import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./pages/Home"
import CreateGame from "./pages/CreateGame"
import JoinGame from "./pages/JoinGame";
import MultiplayerChess from "./components/Game/MultiplayerChess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/chess",
    element: <MultiplayerChess />
  },
  {
    path: "/login",
    element: <Login ></Login>,
  },
  {
    path: "/signup",
    element: <Signup ></Signup>,
  },
  {
    path: "/create",
    element: <CreateGame></CreateGame>
  },
  {
    path: "/join-game",
    element: <JoinGame></JoinGame>
  }
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
