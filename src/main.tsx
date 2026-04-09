import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createAppBrowserRouter } from "./routes";

const router = createAppBrowserRouter();

const root = document.getElementById("app");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </StrictMode>
  );
}
