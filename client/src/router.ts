import React from "react";

const TaskDashboard = React.lazy(
  () => import("./components/TaskDashboard/TaskDashboard")
);

const routes = [
  {
    path: "/",
    element: TaskDashboard,
  },
];

export default routes;
