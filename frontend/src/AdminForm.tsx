import React, { useState } from 'react';
import './AdminForm.scss';
import { useFormState } from 'react-use-form-state';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { addCampaign } from './redux/admin/thunk';



function AdminForm() {
    const dispatch = useDispatch();
    const curDateTime = moment().format();
    const oneDayAfter = moment().add(1, 'days').format();
    const indexOfFormat = curDateTime.indexOf("+");
    const formatedFrom = curDateTime.slice(0, indexOfFormat);
    const formatedTo = oneDayAfter.slice(0, indexOfFormat);
    const [chosenFrom, setChosenFrom] = useState(formatedFrom);
    const [chosenTo, setChosenTo] = useState(formatedTo);
    const [formState, { text }] = useFormState({ name: '' })
    const message = useSelector((oldstate: RootState) => oldstate.admin.message);


    return (
        <form className="admin_form" onSubmit={async (e) => {
            e.preventDefault();
            await dispatch(addCampaign(formState.values.name, formState.values.candidates, chosenFrom, chosenTo));
            formState.clear();
        }}>
            <div>Admin Area</div>
            <input {...text('name')} placeholder="Campaign Name" required />
            <input {...text('candidates')} placeholder="Candidates e.g. Jordan,Kobe,James" required />
            <span>From</span>
            <input type="datetime-local" name="dateTime" value={chosenFrom}
                onChange={(e) => {
                    e.preventDefault();
                    setChosenFrom(e.target.value)
                }} />
            <span>To</span>
            <input type="datetime-local" name="dateTime" value={chosenTo}
                onChange={(e) => {
                    e.preventDefault();
                    setChosenTo(e.target.value)
                }} />

            <input type="submit" value="Create"></input>
            {message && message}
        </form>
    );
}

export default AdminForm;