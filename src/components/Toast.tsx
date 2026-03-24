type ToastProps = {
    message: string;
    type: "success" | "error";
};

function Toast({ message, type }: ToastProps) {
    const isSuccess = type === "success";

    return (
        <div className="fixed inset-x-4 top-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:top-6 sm:justify-end">
            <div
                className={`flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-[fadeIn_.25s_ease-out] ${isSuccess
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-red-200 bg-red-50 text-red-800"
                    }`}
            >
                <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isSuccess
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {isSuccess ? "✓" : "!"}
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold">
                        {isSuccess ? "Operación exitosa" : "Ocurrió un problema"}
                    </p>
                    <p className="mt-1 text-sm leading-5">{message}</p>
                </div>
            </div>
        </div>
    );
}

export default Toast;