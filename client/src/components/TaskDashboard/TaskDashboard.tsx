import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { TaskDetails } from "../../models";
import { deleteTask, loadTaskList } from "../../clients/TodoistClient";
import { useNotifier } from "../Notifier";
import TaskCreationModal from "./TaskCreation";
import WarningModalDialog from "../ModalDialogs/WarningModalDialog";
import { Pencil, Trash } from "react-bootstrap-icons";
import { TaskStatus } from "../../models/Task";

type ColumnType = { dataField?: string; title: string; className: string };
const columns: ColumnType[] = [
  {
    dataField: "name",
    title: "Name",
    className: "col-md-4",
  },
  {
    dataField: "priority",
    title: "Priority",
    className: "col-md-1",
  },
  {
    dataField: "status",
    title: "Status",
    className: "col-md-2",
  },
];

const TaskDashboard = () => {
  const [data, setData] = useState<TaskDetails[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskDetails | null>(null);
  const notifier = useNotifier();

  useEffect(() => {
    (async () => {
      notifier.notifyBusy(true);

      const tasks = await loadTaskList();

      notifier.notifyBusy(false);

      if (!tasks.ok) {
        const error = tasks.val;
        notifier.showError(error.message);
        return;
      }

      setData(tasks.val);
    })();
  }, [setData]);

  const isDisabled = (task: TaskDetails) =>
    task.status !== TaskStatus.Completed;

  const handleCreatedTask = (newTask: TaskDetails) => {
    setData([...data, newTask]);
    setShowCreateModal(false);
  };

  const handleUpdatedTask = (existingTask: TaskDetails) => {
    setData(
      data.map((task) =>
        task.name === existingTask.name ? existingTask : task
      )
    );
    setShowCreateModal(false);
    setCurrentTask(null);
  };

  const handleCloseCreateWindow = () => {
    setShowCreateModal(false);
    setCurrentTask(null);
  };

  const handleDeleteButtonClick = (task: TaskDetails) => {
    setShowWarning(true);
    setCurrentTask(task);
  };

  const handleEditButtonClick = (task: TaskDetails) => {
    setCurrentTask(task);
    setShowCreateModal(true);
  };

  const handleDelete = async (confirmed: boolean) => {
    setShowWarning(false);
    setCurrentTask(null);

    if (!confirmed || !currentTask || isDisabled(currentTask)) {
      return;
    }

    notifier.notifyBusy(true);

    const result = await deleteTask(currentTask.name);

    notifier.notifyBusy(false);

    if (!result.ok) {
      notifier.showError(result.val.message);
    } else {
      // remove deleted item from the task list
      setData((current) =>
        current.filter((task) => task.name !== currentTask.name)
      );
    }
  };

  return (
    <div>
      <Button className="float-end" onClick={() => setShowCreateModal(true)}>
        Create Task
      </Button>

      {showCreateModal && (
        <TaskCreationModal
          show={showCreateModal}
          onCreated={handleCreatedTask}
          onClose={handleCloseCreateWindow}
          currentTask={currentTask}
          onUpdated={handleUpdatedTask}
        />
      )}

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th className="col-md-1">#</th>
            {columns.map((column, idx) => (
              <th key={idx} className={column.className}>
                {column.title}
              </th>
            ))}
            <th className="col-md-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              {columns.map((column, idy) => (
                <td key={idy}>{row[column.dataField as keyof TaskDetails]}</td>
              ))}
              <td>
                <Button
                  variant="secondary"
                  onClick={() => handleEditButtonClick(row)}
                >
                  <Pencil />
                </Button>{" "}
                <Button
                  variant="secondary"
                  onClick={() => handleDeleteButtonClick(row)}
                  disabled={isDisabled(row)}
                >
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showWarning && (
        <WarningModalDialog
          isOpen={showWarning}
          title="Delete task"
          content={`Do you really want to delete "${currentTask?.name}" task?`}
          confirmButtonTitle={"Delete"}
          onCloseCallback={handleDelete}
        />
      )}
    </div>
  );
};

export default TaskDashboard;
