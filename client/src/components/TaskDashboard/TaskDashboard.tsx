import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { TaskDetails } from "../../models";
import { deleteTask, loadTaskList } from "../../clients/TodoistClient";
import { useNotifier } from "../Notifier";
import TaskCreation from "./TaskCreation";
import WarningModalDialog from "../ModalDialogs/WarningModalDialog";

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
  const [taskToDelete, setTaskToDelete] = useState<string>("");
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

  const updateTasks = (newTask: TaskDetails) => setData([...data, newTask]);

  const handleDeleteButtonClick = (taskName: string) => {
    setShowWarning(true);
    setTaskToDelete(taskName);
  };

  const handleDelete = async (confirmed: boolean) => {
    setShowWarning(false);

    if (!confirmed) {
      return;
    }

    notifier.notifyBusy(true);

    const result = await deleteTask(taskToDelete);

    notifier.notifyBusy(false);

    if (!result.ok) {
      notifier.showError(result.val.message);
    } else {
      // remove deleted item from the task list
      setData((current) =>
        current.filter((task) => task.name !== taskToDelete)
      );
    }
  };

  return (
    <div>
      <TaskCreation updateList={updateTasks} />

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
              <td>{idx}</td>
              {columns.map((column, idy) => (
                <td key={idy}>{row[column.dataField as keyof TaskDetails]}</td>
              ))}
              <td>
                <Button>Edit</Button>
                <Button onClick={() => handleDeleteButtonClick(row.name)}>
                  Delete
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
          content={`Do you really want to delete "${taskToDelete}" task?`}
          confirmButtonTitle={"Delete"}
          onCloseCallback={handleDelete}
        />
      )}
    </div>
  );
};

export default TaskDashboard;
