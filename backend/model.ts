declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export interface User {
    id: number;
    username: string;
    password: string;
}

export interface Client {
    id: number;
    hkid: string;
}

export interface Campaign {
    id: number;
    name: string;
    from_time: string;
    to_time: string;
}

export interface CampaignClient {
    id: number;
    campaign_id: number;
    client_id: number;
}

export interface CandidatesMapping {
    [key: number]: Candidate[];
}

export interface Candidate {
    id: number;
    name: string;
    vote: number;
    youVoted: boolean;
}

export interface CandidateWithVote {
    id: number;
    name: string;
    campaignId: number;
    count: number;
}

export interface VoteOfCandidates {
    name: string;
    id: number;
    count: string;
}
