import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { TaskDetails } from "../../models";
import { SUPPORTED_STATUSES } from "../../models/Task";

type ErrorsType = {
  name: string | null;
};

const initialState: TaskDetails = {
  name: "",
  priority: 0,
  status: SUPPORTED_STATUSES[0],
};

const initErrors: ErrorsType = {
  name: null,
};

const TaskCreation = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [taskDetails, setTaskDetails] = useState<TaskDetails>(initialState);
  const [errors, setErrors] = useState<ErrorsType>(initErrors);

  const validateForm = () =>
    setErrors({
      ...errors,
      name: !taskDetails.name ? "Name is mandatory" : null,
    });

  const handleShow = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  const handleInputChange =
    (property: keyof TaskDetails) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setTaskDetails({ ...taskDetails, [property]: event.target.value });

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setTaskDetails({ ...taskDetails, status: event.target.value });

  const handleSubmit = () => {
    validateForm();

    // todo: validate
    // todo: call API
    // if (true) {
    // setErrors({ ...errors, name: "Task with this name already exists" });
    // } else {
    //   setIsValidForm(true);

    //   setShowDialog(false);
    // }
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
            <Form.Group>
              <Form.Label htmlFor="taskName">Name</Form.Label>
              <Form.Control
                id="taskName"
                required
                onChange={handleInputChange("name")}
                isInvalid={!!errors.name}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="taskPriority">Priority</Form.Label>
              <Form.Control
                id="taskPriority"
                type="number"
                onChange={handleInputChange("priority")}
                defaultValue={taskDetails.priority}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="taskStatus">Status</Form.Label>
              <Form.Select
                id="taskStatus"
                defaultValue={taskDetails.status}
                onChange={handleSelectChange}
              >
                {SUPPORTED_STATUSES.map((status, idx) => (
                  <option key={idx}>{status}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskCreation;
