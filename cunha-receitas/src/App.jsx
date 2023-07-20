import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Home } from "./Home";
import { NavBar } from "./NavBar";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
