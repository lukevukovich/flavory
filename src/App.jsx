import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// layouts and pages
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home/Home";
import Discover from "./pages/Discover/Discover";
import Saved from "./pages/Saved/Saved";
import Recipe from "./pages/Recipe/Recipe";
import "./App.css";

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="discover" element={<Discover />} />
      <Route path="saved" element={<Saved />} />
      <Route path="recipe/:id" element={<Recipe />} />
      <Route path="*" element={<Home />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
