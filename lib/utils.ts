export const validateString = (value: unknown, maxLength: number): value is string => {
    if (!value || typeof value !== "string" || value.length > maxLength) {
        return false
    }

    return true
}

export const getErrorMessage = (error: unknown): string => {
    const maxLength = 350
    let message: string

    if (error instanceof Error) {
        message = error.message
    } else if (error && typeof error === "object" && "message" in error) {
        message = String(error.message)
    } else if (typeof error === "string") {
        message = error
    } else {
        message = "Aww snap something went wrong..."
    }

    /** @dev Truncate the message if it's longer than 500 characters */

    const regex = /DRM__\w*/g
    const matches = message.match(regex)

    if (matches && matches.length > 0) {
        return "Transaction Error: " + matches[0] // Returns the first match containing 'DRM'
    } else if (message.includes("Token does not exist")) {
        return "Transaction Error: \nToken Does Not Exist"
    } else if (message.includes("user rejected transaction")) {
        return "Transaction Error: \nUser Rejected Transaction"
    } else {
        if (message.length > maxLength) {
            message = message.substring(0, maxLength) + "..."
        }

        return message
    }
}
