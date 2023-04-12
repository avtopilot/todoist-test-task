import React from "react";
import { Button, Table } from "react-bootstrap";

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

type DataType = {
  name: string;
  priority: string;
  status: string;
};
const data: DataType[] = [
  { name: "todo 1", priority: "high", status: "to do" },
  { name: "todo 2", priority: "critical", status: "in progress" },
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
          <tr>
            <td>{idx}</td>
            {columns.map((column) => (
              <td>{row[column.dataField as keyof DataType]}</td>
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
