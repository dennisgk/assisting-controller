import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { deps, pages, components, utils } from "../meta";

const Root = () => {
  const router = utils.react.use_ref(
    createBrowserRouter(
      createRoutesFromElements(
        <>
          <deps.router.Route path="" element={<pages.home.Home />} />
          <deps.router.Route path="proc" element={<pages.proc.Proc />} />
          <deps.router.Route
            path="settings"
            element={<pages.settings.Settings />}
          />
          <deps.router.Route path="edit/*" element={<pages.edit.Edit />} />
          <deps.router.Route path="run" element={<pages.run.Run />} />
          <deps.router.Route
            path="*"
            element={<deps.router.Navigate to="/" />}
          />
        </>
      )
    )
  );

  return (
    <components.ac.api.Provider>
      <RouterProvider router={router.current} />
    </components.ac.api.Provider>
  );
};

export { Root };
