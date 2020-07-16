import { ThunkDispatch } from "../../store";
import { setCampaign } from "./action";


export function getCampaign() {
    return async (dispatch: ThunkDispatch) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaign`)

        const json = await res.json();

        dispatch(setCampaign(json.campaigns));
    }
}

export function voting(campaignId: number, hkid: string, candidateId: number) {
    return async (dispatch: ThunkDispatch) => {

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaign/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                campaignId: campaignId,
                hkid: hkid,
                candidateId: candidateId
            })
        })

        const json = await res.json();

        alert(json.msg)

    }
}