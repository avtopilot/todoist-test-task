import React from "react";
import { Button, Modal } from "react-bootstrap";

type WarningModalDialogProps = {
  title: string;
  content?: string;
  confirmButtonTitle: string;
  isOpen: boolean;
  onCloseCallback: (confirm: boolean) => void;
};

const WarningModalDialog = (props: WarningModalDialogProps) => {
  const confirm = () => props.onCloseCallback(true);
  const cancel = () => props.onCloseCallback(false);

  return (
    <Modal show={props.isOpen} onHide={cancel} centered>
      <Modal.Header closeButton>{props.title}</Modal.Header>
      <Modal.Body>{props.content}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={confirm}>
          {props.confirmButtonTitle}
        </Button>
        <Button variant="secondary" onClick={cancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarningModalDialog;
