import { AuthActions } from "./action"


export interface UserState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean | null;
    message: string | null;
}

export interface User {
    id: number;
    username: string;
}

const initialState = {
    token: localStorage.getItem('token'),
    user: null,
    isAuthenticated: null,
    message: null
}

export const userReducer = (state: UserState = initialState, action: AuthActions): UserState => {
    switch (action.type) {
        case "@@AUTH/LOGIN_SUCCESS":
            return {
                ...state,
                token: action.token,
                isAuthenticated: true,
                message: null,
            }
        case "@@AUTH/LOGIN_FAILED":
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                message: action.message
            }
        case "@@AUTH/MESSAGE_RESET":
            return {
                ...state,
                message: null
            }
        case "@@AUTH/GET_USER":
            return {
                ...state,
                user: action.user
            }
        case "@@AUTH/LOGOUT":
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                message: null
            }
        case '@@AUTH/SET_MESSAGE':
            return {
                ...state,
                message: action.message
            }

    }
    return state;
}