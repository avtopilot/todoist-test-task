import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { TaskDetails } from "../../models";
import { TaskStatus } from "../../models/Task";
import { useNotifier } from "../Notifier";
import { createTask, updateTask } from "../../clients/TodoistClient";
import { inRange } from "../../helpers/numberHelper";

type ErrorsType = {
  name: string | null;
  priority: string | null;
};

const initialState: TaskDetails = {
  name: "",
  priority: 0,
  status: TaskStatus.InProgress,
};

const initErrors: ErrorsType = {
  name: null,
  priority: null,
};

type TaskCreationProps = {
  show: boolean;
  onClose: () => void;
  onCreated: (newTask: TaskDetails) => void;
  // if defined it's an edition
  currentTask: TaskDetails | null;
  onUpdated: (task: TaskDetails) => void;
};

const TaskCreationModal = (props: TaskCreationProps) => {
  const [taskDetails, setTaskDetails] = useState<TaskDetails>(initialState);
  const [errors, setErrors] = useState<ErrorsType>(initErrors);
  const isCreation = !props.currentTask;
  const notifier = useNotifier();

  useEffect(() => {
    if (props.currentTask) {
      setTaskDetails(props.currentTask);
    }
  }, [props.currentTask]);

  useEffect(() => validateForm(), [taskDetails]);

  const validateForm = () =>
    setErrors({
      ...errors,
      name: !taskDetails.name ? "Name is mandatory" : null,
      priority: !inRange(taskDetails.priority, 0, 100)
        ? "Priority should be in range of 0 - 100"
        : null,
    });

  const handleInputChange =
    (property: keyof TaskDetails) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setTaskDetails({ ...taskDetails, [property]: event.target.value });

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setTaskDetails({
      ...taskDetails,
      status: TaskStatus[event.target.value as keyof typeof TaskStatus],
    });

  const handleSubmit = async () => {
    //do not send creation API request if there are any incorrectly filled fields
    if (!Object.values(errors).every((value) => !value)) {
      return;
    }

    isCreation ? await handleCreateTask() : await handleUpdateTask();
  };

  const handleCreateTask = async () => {
    notifier.notifyBusy(true);

    const result = await createTask(taskDetails);

    notifier.notifyBusy(false);

    if (!result.ok) {
      if (result.val.statusCode === 409) {
        setErrors({ ...errors, name: "Task with this name already exists" });
      } else {
        notifier.showError(result.val.message);
      }
    } else {
      props.onCreated(taskDetails);
    }
  };

  const handleUpdateTask = async () => {
    notifier.notifyBusy(true);

    const result = await updateTask(taskDetails);

    notifier.notifyBusy(false);

    if (!result.ok) {
      notifier.showError(result.val.message);
    } else {
      props.onUpdated(taskDetails);
    }
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
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
              value={taskDetails.name}
              disabled={!isCreation}
            />
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
              value={taskDetails.priority}
            />
            <Form.Control.Feedback type="invalid">
              {errors.priority}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="taskStatus">Status</Form.Label>
            <Form.Select
              id="taskStatus"
              value={taskDetails.status}
              onChange={handleSelectChange}
            >
              {Object.values(TaskStatus).map((status, idx) => (
                <option key={idx}>{status}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          {isCreation ? "Create" : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskCreationModal;
