import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { TaskDetails } from "../../models";
import { loadTaskList } from "../../clients/TodoistClient";
import { useNotifier } from "../Notifier";

type ColumnType = { dataField?: string; title: string };
const columns: ColumnType[] = [
  {
    dataField: "name",
    title: "Name",
  },
  {
    dataField: "priority",
    title: "Priority",
  },
  {
    dataField: "status",
    title: "Status",
  },
];

const TaskList = () => {
  const [data, setData] = useState<TaskDetails[]>([]);
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

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          {columns.map((column, idx) => (
            <th key={idx}>{column.title}</th>
          ))}
          <th>Actions</th>
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
              <Button>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TaskList;
