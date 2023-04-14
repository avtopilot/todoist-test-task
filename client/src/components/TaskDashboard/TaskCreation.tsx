import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { TaskDetails } from "../../models";
import { SUPPORTED_STATUSES } from "../../models/Task";
import { useNotifier } from "../Notifier";
import { createTask } from "../../clients/TodoistClient";
import { inRange } from "../../helpers/numberHelper";

type ErrorsType = {
  name: string | null;
  priority: string | null;
};

const initialState: TaskDetails = {
  name: "",
  priority: 0,
  status: SUPPORTED_STATUSES[0],
};

const initErrors: ErrorsType = {
  name: null,
  priority: null,
};

type TaskCreationProps = {
  updateList: (newTask: TaskDetails) => void;
};

const TaskCreation = (props: TaskCreationProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [taskDetails, setTaskDetails] = useState<TaskDetails>(initialState);
  const [errors, setErrors] = useState<ErrorsType>(initErrors);
  const notifier = useNotifier();

  useEffect(() => validateForm(), [taskDetails]);

  const validateForm = () =>
    setErrors({
      ...errors,
      name: !taskDetails.name ? "Name is mandatory" : null,
      priority: !inRange(taskDetails.priority, 0, 100)
        ? "Priority should be in range of 0 - 100"
        : null,
    });

  const handleShow = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  const handleInputChange =
    (property: keyof TaskDetails) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setTaskDetails({ ...taskDetails, [property]: event.target.value });

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setTaskDetails({ ...taskDetails, status: event.target.value });

  const handleSubmit = async () => {
    //do not send creation API request if there are any incorrectly filled fields
    if (!Object.values(errors).every((value) => !value)) {
      return;
    }

    notifier.notifyBusy(true);

    const result = await createTask(taskDetails);

    notifier.notifyBusy(false);

    if (!result.ok) {
      if (result.val.statusCode == 409) {
        setErrors({ ...errors, name: "Task with this name already exists" });
      } else {
        notifier.showError(result.val.message);
      }
    } else {
      setShowDialog(false);
      props.updateList(taskDetails);
    }
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
                min={0}
                max={100}
                isInvalid={!!errors.priority}
                onChange={handleInputChange("priority")}
                defaultValue={taskDetails.priority}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.priority}
              </Form.Control.Feedback>
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
