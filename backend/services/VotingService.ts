import Knex from 'knex';
import moment from 'moment';
import 'moment-timezone';
import { client, CampaignClient, CampaignsWithCandidates } from '../model';


export class VotingService {

    constructor(private knex: Knex) {
    }

    getCampaign = async () => {

        const campaigns = await this.knex('campaigns').select(
            'id',
            'name',
            'from_time',
            'to_time'
        ).orderBy('to_time', 'desc')

        const voteOfCandidates = await this.knex.select(
            'candidates.id',
            'candidates.name',
            'candidates.campaign_id as campaignId',
            'campaigns.id as campaignCount'
        ).from('campaigns_clients')
            .leftJoin('campaigns', 'campaigns.id', 'campaigns_clients.campaign_id')
            .fullOuterJoin('candidates', 'candidates.id', 'campaigns_clients.candidate_id')
            .groupBy('candidates.id', 'candidates.name', 'campaignId', 'campaignCount')
            .count('campaigns.id')
            .orderBy([{ column: 'campaignId', order: 'desc' }, { column: 'count', order: 'desc' }]);


        let campaignsWithCandidates: CampaignsWithCandidates[] = [];

        for (let campaign of campaigns) {
            for (let candidate of voteOfCandidates) {
                if (campaign.id == candidate.campaignId) {
                    if (campaign["candidates"]) {
                        campaign["candidates"].push({ id: candidate.id, name: candidate.name, vote: candidate.count })
                    } else {
                        campaign["candidates"] = [];
                        campaign["candidates"].push({ id: candidate.id, name: candidate.name, vote: candidate.count })
                    }
                }
            }
            campaignsWithCandidates.push(campaign)
        }

        return campaignsWithCandidates;
    }


    voting = async (campaignId: number, hkid: string, candidateId: number) => {

        if (hkid == '') {
            return "Please enter HKID !"
        } else if (hkid.length !== 10 &&
            hkid.match(/^([A-Z]{1,2})([0-9]{6})\(([A0-9])\)$/) === null) {
            return "Incorrect HKID !"
        }

        let campaign = (await this.knex('campaigns')
            .where('id', campaignId)
            .select(
                'from_time',
                'to_time'
            ))[0]

        const curTime = (moment.tz(moment(), 'Hongkong'))

        if (moment.tz(campaign.to_time, 'Hongkong') <= curTime || moment.tz(campaign.from_time, 'Hongkong') > curTime) {
            return "Voting period error! please contact the technician."
        }

        let clientId: client[] = (await this.knex('clients')
            .where('hkid', hkid)
            .select(
                'id',
                'hkid'
            ))

        let alreadyVoted: CampaignClient[]

        if (!clientId[0]) {
            const newClientId: number = (await this.knex('clients').returning('id').insert({ hkid: hkid }))[0]

            await this.knex('campaigns_clients').where({
                campaign_id: campaignId,
                client_id: newClientId
            })

            await this.knex('campaigns_clients').insert({
                'campaign_id': campaignId,
                'client_id': newClientId,
                'candidate_id': candidateId
            });

            return "Thank you for your participation! Result will be published when campaign finishes."

        } else {
            alreadyVoted = await this.knex('campaigns_clients').where({
                campaign_id: campaignId,
                client_id: clientId[0].id
            })

            if (alreadyVoted[0]) {
                return "You've already voted!"
            }

            await this.knex('campaigns_clients').insert({
                'campaign_id': campaignId,
                'client_id': clientId[0].id,
                'candidate_id': candidateId
            });

            return "Thank you for your participation! Result will be published when campaign finishes."
        }

    }
}


// const knexConfig = require('../knexfile');
// const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

// const x = new VotingService(knex);
// x.getCampaign()