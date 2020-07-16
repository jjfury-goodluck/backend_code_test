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

export interface CampaignsWithCandidates {
    id: number;
    name: string;
    from_time: string;
    to_time: string;
    candidates: Candidate[];
}

export interface Candidate {
    id: number;
    name: string;
    campaign_id: number;
}

export interface VoteOfCandidates {
    name: string;
    id: number;
    count: string;
} 