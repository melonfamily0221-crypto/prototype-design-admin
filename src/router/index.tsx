import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "@/layout/AdminLayout";
import Dashboard from "@/pages/dashboard";

const router = createBrowserRouter([
  {
    path: "/login",
    async lazy() {
      let { default: Component } = await import("@/pages/login/index");
      return { Component };
    },
  },
  {
    path: "/signup",
    async lazy() {
      let { default: Component } = await import("@/pages/signup/index");
      return { Component };
    },
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "dataset-development",
        async lazy() {
          let { default: Component } = await import("@/pages/dataset-development/index");
          return { Component };
        },
      },
      {
        path: "contract-clause-management",
        async lazy() {
          let { default: Component } = await import("@/pages/contract-clause-management/index");
          return { Component };
        },
      },
      {
        path: "contract-clause-management/detail",
        async lazy() {
          let { default: Component } = await import("@/pages/contract-clause-management/detail");
          return { Component };
        },
      },
      {
        path: "device-group-list",
        async lazy() {
          let { default: Component } = await import("@/pages/device-group-list/index");
          return { Component };
        },
      },
    ],
  },
]);

export default router;
