export function setMessage(message: string) {
    return {
        type: '@@ADMIN/SET_MESSAGE' as '@@ADMIN/SET_MESSAGE',
        message
    }
}

export function resetMessage() {
    return {
        type: '@@ADMIN/MESSAGE_RESET' as '@@ADMIN/MESSAGE_RESET',
    }
}


export type AdminActions =
    ReturnType<typeof resetMessage> |
    ReturnType<typeof setMessage>;