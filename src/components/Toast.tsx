type ToastProps = {
    message: string;
    type: "success" | "error";
};

function Toast({ message, type }: ToastProps) {
    return (
        <div
            className={`fixed top-4 right-4 px-4 py-3 rounded shadow-lg text-white z-50 ${type === "success" ? "bg-green-600" : "bg-red-600"
                }`}
        >
            {message}
        </div>
    );
}

export default Toast;