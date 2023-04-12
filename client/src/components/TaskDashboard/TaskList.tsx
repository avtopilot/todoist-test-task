import React from "react";
import { Button, Table } from "react-bootstrap";
import { TaskDetails } from "../../models";

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

const data: TaskDetails[] = [
  { name: "todo 1", priority: 5, status: "to do" },
  { name: "todo 2", priority: 10, status: "in progress" },
];

const TaskList = () => {
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
