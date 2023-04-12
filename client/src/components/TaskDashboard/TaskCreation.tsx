import React, { useState } from "react";
import { FormControl, FormLabel, FormSelect } from "react-bootstrap";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";
import { TaskDetails } from "../../models";
import { SUPPORTED_STATUSES } from "../../models/Task";

const initialState: TaskDetails = {
  name: "",
  priority: 0,
  status: SUPPORTED_STATUSES[0],
};

const TaskCreation = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [taskDetails, setTaskDetails] = useState<TaskDetails>(initialState);

  const handleShow = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  const handleInputChange =
    (property: keyof TaskDetails) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setTaskDetails({ ...taskDetails, [property]: event.target.value });

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setTaskDetails({ ...taskDetails, status: event.target.value });

  const handleSubmit = () => {
    // todo: validate
    // todo: call API
    // if success
    setShowDialog(false);
  };

  return (
    <>
      <Button className="float-end" onClick={handleShow}>
        Create Task
      </Button>

      <Modal show={showDialog} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new TODO task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form autoComplete="off">
            <FormGroup>
              <FormLabel htmlFor="taskName">Name</FormLabel>
              <FormControl
                id="taskName"
                required
                onChange={handleInputChange("name")}
              ></FormControl>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="taskPriority">Priority</FormLabel>
              <FormControl
                id="taskPriority"
                type="number"
                onChange={handleInputChange("priority")}
                defaultValue={taskDetails.priority}
              ></FormControl>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="taskStatus">Status</FormLabel>
              <FormSelect
                id="taskStatus"
                defaultValue={taskDetails.status}
                onChange={handleSelectChange}
              >
                {SUPPORTED_STATUSES.map((status, idx) => (
                  <option key={idx}>{status}</option>
                ))}
              </FormSelect>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskCreation;
