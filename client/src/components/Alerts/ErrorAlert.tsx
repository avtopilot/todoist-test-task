import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ErrorAlert = (props: { message: string; show: boolean }) => {
  const [show, setShow] = useState(props.show);

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast
        bg="danger"
        onClose={() => setShow(false)}
        show={show}
        delay={5000}
        autohide
      >
        <Toast.Header closeButton>
          <strong className="me-auto">Oh snap! You got an error!</strong>
        </Toast.Header>
        <Toast.Body>{props.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ErrorAlert;
