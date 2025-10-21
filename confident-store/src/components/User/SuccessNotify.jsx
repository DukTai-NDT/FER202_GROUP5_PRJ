import { Alert } from "react-bootstrap";

const SuccessNotify = ({ message, variant, onClose }) => {
  if (!message) return null;

  return (
    <Alert variant={variant} onClose={onClose} dismissible>
      {message}
    </Alert>
  );
};

export default SuccessNotify;
