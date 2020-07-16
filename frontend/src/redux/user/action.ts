import { User } from "./reducer";

export function loginSuccess(token: string) {
    return {
        type: '@@AUTH/LOGIN_SUCCESS' as '@@AUTH/LOGIN_SUCCESS',
        token
    }
}

export function loginFailed(message: string) {
    return {
        type: '@@AUTH/LOGIN_FAILED' as '@@AUTH/LOGIN_FAILED',
        message
    }
}

export function getUser(user: User) {
    return {
        type: '@@AUTH/GET_USER' as '@@AUTH/GET_USER',
        user
    }
}

export function setMessage(message: string) {
    return {
        type: '@@AUTH/SET_MESSAGE' as '@@AUTH/SET_MESSAGE',
        message
    }
}

export function resetMessage() {
    return {
        type: '@@AUTH/MESSAGE_RESET' as '@@AUTH/MESSAGE_RESET',
    }
}

export function logout() {
    return {
        type: '@@AUTH/LOGOUT' as '@@AUTH/LOGOUT'
    }
}


export type AuthActions =
    ReturnType<typeof loginSuccess> |
    ReturnType<typeof loginFailed> |
    ReturnType<typeof resetMessage> |
    ReturnType<typeof logout> |
    ReturnType<typeof getUser> |
    ReturnType<typeof setMessage>;