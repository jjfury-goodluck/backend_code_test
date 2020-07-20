import { Campaign, Client } from "./reducer";

export function setCampaign(campaign: Campaign[]) {
    return {
        type: '@@CAMPAIGN/SET' as '@@CAMPAIGN/SET',
        campaign
    }
}

export function setClient(client: Client) {
    return {
        type: '@@CAMPAIGN/SET_CLIENT' as '@@CAMPAIGN/SET_CLIENT',
        client
    }
}

export function setMessage(message: string) {
    return {
        type: '@@CAMPAIGN/SET_MESSAGE' as '@@CAMPAIGN/SET_MESSAGE',
        message
    }
}


export type CampaignActions =
    ReturnType<typeof setCampaign> |
    ReturnType<typeof setClient> |
    ReturnType<typeof setMessage>;