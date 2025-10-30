import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteUserModal = ({ show, handleClose, onConfirm, user }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete user:{" "}
        <strong>{user?.username}</strong>?
        <br />
        <span className="text-danger">
          This action cannot be undone. Consider locking the user instead.
        </span>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal;