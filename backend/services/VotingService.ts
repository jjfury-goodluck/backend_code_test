import Knex from 'knex';
import { client, CampaignClient } from '../model';


export class VotingService {
    constructor(private knex: Knex) { }

    getCampaign = async () => {

        const campaigns = await this.knex('campaigns').select(
            'id',
            'name',
            'from_time',
            'to_time'
        )

        return campaigns;
    }

    getVote = async (campaignId: number) => {

        const candidates = await this.knex('candidates').select(
            'id',
            'name',
            'campaign_id'
        ).where('campaign_id', campaignId)

        const voteOfCandidates = await this.knex.select(
            'candidates.name',
            'campaigns.id'
        ).from('campaigns_clients')
            .leftJoin('campaigns', 'campaigns.id', 'campaigns_clients.campaign_id')
            .leftJoin('candidates', 'candidates.id', 'campaigns_clients.candidate_id')
            .groupBy('candidates.name', 'campaigns.id')
            .count('candidates.name')
            .where('campaigns.id', campaignId)

        return {
            candidates: candidates,
            voteOfCandidates: voteOfCandidates
        }
    }

    voting = async (campaignId: number, hkid: string, candidateId: number) => {

        //差個時間控制

        let clientId: client[] = (await this.knex('clients').where('hkid', hkid))

        if (!clientId[0]) {
            clientId = await this.knex('clients').returning('id').insert({ hkid: hkid })
        }

        const alreadyVoted: CampaignClient[] = await this.knex('campaigns_clients').where({
            campaign_id: campaignId,
            client_id: clientId
        })

        if (alreadyVoted[0]) {
            return "You've already voted!"
        }

        await this.knex('campaigns_clients').insert({
            'campaign_id': campaignId,
            'client_id': clientId,
            'candidate_id': candidateId
        });

        return "You've voted!"
    }
}


// const knexConfig = require('../knexfile');
// const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

// const x = new VotingService(knex);
// x.getVote(4)