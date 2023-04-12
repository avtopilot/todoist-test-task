import React from "react";
import { Button } from "react-bootstrap";
import TaskList from "./TaskList";

const TaskDashboard = () => (
  <div>
    <Button className="float-end">Create Task</Button>
    <TaskList />
  </div>
);

export default TaskDashboard;
