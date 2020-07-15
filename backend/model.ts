declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export interface User {
    id: number;
    username: string;
    password: string;
}

export interface client {
    id: number;
    hkid: string;
}

export interface CampaignClient {
    id: number;
    campaign_id: number;
    client_id: number;
}