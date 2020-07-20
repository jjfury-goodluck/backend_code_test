import { ThunkDispatch } from "../../store";
import { setCampaign, setClient, setMessage } from "./action";


export function getCampaign() {
    return async (dispatch: ThunkDispatch) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaign`)

        const json = await res.json();

        dispatch(setCampaign(json.campaigns));
    }
}

export function getCampaignWithClient(clientId: number) {
    return async (dispatch: ThunkDispatch) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId
            })
        })

        const json = await res.json();

        dispatch(setCampaign(json.campaigns));
    }
}

export function registerHKID(hkid: string) {
    return async (dispatch: ThunkDispatch) => {

        if (hkid === '') {
            alert("Please enter HKID !")
            return
        } else if (hkid.length !== 10 &&
            hkid.match(/^([A-Z]{1,2})([0-9]{6})\(([A0-9])\)$/) === null) {
            alert("Incorrect HKID !")
            return
        }

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaign/hkid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hkid: hkid })
        })

        const json = await res.json();

        dispatch(setClient(json.client))
        dispatch(setMessage(json.msg))

    }
}

export function voting(campaignId: number, hkid: string, clientId: number, candidateId: number) {
    return async (dispatch: ThunkDispatch) => {
        if (hkid === '') {
            alert("Please enter HKID !")
        } else if (hkid.length !== 10 &&
            hkid.match(/^([A-Z]{1,2})([0-9]{6})\(([A0-9])\)$/) === null) {
            alert("Incorrect HKID !")
        }
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaign/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                campaignId: campaignId,
                hkid: hkid,
                clientId: clientId,
                candidateId: candidateId
            })
        })

        const json = await res.json();

        alert(json.msg)

    }
}