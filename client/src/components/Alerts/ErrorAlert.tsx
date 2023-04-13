import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";

const ErrorAlert = (props: { message: string; show: boolean }) => {
  const [show, setShow] = useState(props.show);

  useEffect(() => {
    window.setTimeout(() => {
      setShow(false);
    }, 5000);
  });

  return show ? (
    <Alert
      variant="danger"
      role="alert"
      onClose={() => setShow(false)}
      dismissible
    >
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      <p>{props.message}</p>
    </Alert>
  ) : null;
};

export default ErrorAlert;
