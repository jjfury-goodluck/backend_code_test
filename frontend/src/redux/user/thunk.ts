import { ThunkDispatch, RootState } from "../../store";
import { loginFailed, loginSuccess, logout, getUser } from "./action";


export function login(username: string, password: string) {
    return async (dispatch: ThunkDispatch) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        const json = await res.json();

        if (json.token != null) {
            localStorage.setItem('token', json.token)
            dispatch(loginSuccess(json.token));
            dispatch(restoreLogin())
        }
    }
}

export function restoreLogin() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const token = getState().user.token;

        if (token == null) {
            dispatch(logout());
            return;
        }

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/current`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        const json = await res.json();

        if (res.status !== 200) {

            dispatch(loginFailed(json.msg))
        } else {
            dispatch(loginSuccess(token))
            dispatch(getUser(json))
        }
    }
}

export function thunkLogout() {
    return async (dispatch: ThunkDispatch) => {
        localStorage.removeItem('token')
        dispatch(logout())
    }
}