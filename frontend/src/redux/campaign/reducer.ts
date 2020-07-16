import { CampaignActions } from "./action"


export interface CampaignState {
    campaign: Campaign[]
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
}

const initialState = {
    campaign: [],
    message: null
}

export const campaignReducer = (state: CampaignState = initialState, action: CampaignActions): CampaignState => {
    switch (action.type) {
        case "@@CAMPAIGN/SET":
            return {
                ...state,
                campaign: action.campaign
            }

        case "@@CAMPAIGN/SET_MESSAGE":
            return {
                ...state,
                message: action.message
            }

    }
    return state;
}