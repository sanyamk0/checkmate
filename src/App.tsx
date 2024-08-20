import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Referee from "./components/Referee";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Referee />
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
