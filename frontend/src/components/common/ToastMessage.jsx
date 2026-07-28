import { Toast, ToastContainer } from "react-bootstrap";

function ToastMessage({
    show,
    setShow,
    message,
    type = "success"
}) {
    return (
        <ToastContainer
            position="top-end"
            className="p-3"
        >
            <Toast
                bg={type}
                show={show}
                onClose={() => setShow(false)}
                delay={3000}
                autohide
            >
                <Toast.Body className="text-white">
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastMessage;