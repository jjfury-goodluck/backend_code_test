import React from 'react';
import './LoginForm.scss';
import { useFormState } from 'react-use-form-state';
import { useDispatch } from 'react-redux';
import { login } from './redux/user/thunk';


function LoginForm() {
    const dispatch = useDispatch();
    const [formState, { text, password }] = useFormState({
        username: '',
        password: ''
    })

    return (
        <form className="login_form" onSubmit={async (e) => {
            e.preventDefault();
            dispatch(login(formState.values.username, formState.values.password))
        }}>
            <div>Admin Area</div>
            <input {...text('username')} placeholder="Username" required />
            <input {...password('password')} placeholder="Password" required minLength={8} />
            <input type="submit" value="Submit"></input>
        </form>
    );
}

export default LoginForm;