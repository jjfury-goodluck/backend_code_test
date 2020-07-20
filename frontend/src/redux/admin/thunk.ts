import moment from 'moment';
import { ThunkDispatch, RootState } from "../../store";
import { setMessage } from "./action";


export function addCampaign(name: string, candidates: string, from: string, to: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const curDateTime = moment()
        if (moment(from).isSameOrAfter(to) || moment(from).isBefore(curDateTime)) {
            dispatch(setMessage("Wrong time interval"))
            return
        }

        const token = getState().user.token;

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/new_campaign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                candidates: candidates,
                from: from,
                to: to
            })
        })

        const json = await res.json();

        dispatch(setMessage(json.msg));

    }
}