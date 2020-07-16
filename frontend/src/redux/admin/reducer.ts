import { AdminActions } from "./action"


export interface AdminState {
    message: string | null;
}

const initialState = {
    message: null
}

export const adminReducer = (state: AdminState = initialState, action: AdminActions): AdminState => {
    switch (action.type) {


        case '@@ADMIN/SET_MESSAGE':
            return {
                ...state,
                message: action.message
            }
        case "@@ADMIN/MESSAGE_RESET":
            return {
                ...state,
                message: null
            }
    }
    return state;
}