import toast from "react-hot-toast"

export async function handleSuccess(message: string) {
    toast.success(message, {
        style: {
            border: "1px solid rgba(67, 52, 28, 0.8)",
            background: "rgba(37, 32, 35, 0.4)",
            padding: "15px",
            color: "rgba(203, 207, 204, 1)",
        },
        iconTheme: {
            primary: "rgba(49, 169, 73, 1)",
            secondary: "black",
        },
    })
}

export async function handleError(errorMessage: string) {
    toast.error(errorMessage, {
        style: {
            border: "1px solid #713200",
            background: "rgba(37, 32, 35, 0.4)",
            padding: "15px",
            color: "rgba(203, 207, 204, 1)",
        },
        iconTheme: {
            primary: "#713200",
            secondary: "black",
        },
    })
}
