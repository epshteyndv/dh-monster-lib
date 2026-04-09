import { createBrowserRouter } from "react-router-dom";
import { EncounterPage } from "./EncounterPage";

/**
 * React Router expects basename with a leading slash and no trailing slash.
 */
export function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") return undefined;
  const trimmed = base.replace(/\/$/, "");
  return trimmed === "" ? undefined : trimmed;
}

export function createAppBrowserRouter() {
  return createBrowserRouter(
    [{ path: "/", element: <EncounterPage /> }],
    { basename: routerBasename() }
  );
}
