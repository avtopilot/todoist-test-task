import React from "react";

const TaskList = React.lazy(() => import("./components/TaskList/TaskList"));

const routes = [
  {
    path: "/",
    element: TaskList,
  },
];

export default routes;
