import { CampaignActions } from "./action"


export interface CampaignState {
    campaign: Campaign[];
    client: Client | null;
    message: string | null;
}

export interface Campaign {
    id: number;
    name: string;
    from_time: string;
    to_time: string;
    candidates: Candidates[];
}

interface Candidates {
    id: number;
    name: string;
    vote: number;
    youVoted: boolean;
}

export interface Client {
    id: number;
    hkid: string;
}

const initialState = {
    campaign: [],
    client: null,
    message: null
}

export const campaignReducer = (state: CampaignState = initialState, action: CampaignActions): CampaignState => {
    switch (action.type) {
        case "@@CAMPAIGN/SET":
            return {
                ...state,
                campaign: action.campaign
            }

        case "@@CAMPAIGN/SET_CLIENT":
            return {
                ...state,
                client: action.client
            }

        case "@@CAMPAIGN/SET_MESSAGE":
            return {
                ...state,
                message: action.message
            }

    }
    return state;
}