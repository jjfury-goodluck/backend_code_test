import Knex from 'knex';
import moment from 'moment';
import {
    Client,
    CampaignClient,
    Campaign,
    CandidateWithVote,
    CandidatesMapping,
} from '../model';

export class VotingService {
    constructor(private knex: Knex) {}

    getCampaigns = async () => {
        const campaigns: Campaign[] = await this.knex('campaigns')
            .select('id', 'name', 'from_time', 'to_time')
            .orderBy('to_time', 'desc');

        const candidates = ((await this.knex
            .select(
                'candidates.id',
                'candidates.name',
                'candidates.campaign_id as campaignId'
            )
            .from('campaigns_clients')
            .fullOuterJoin(
                'candidates',
                'candidates.id',
                'campaigns_clients.candidate_id'
            )
            .groupBy('candidates.id', 'candidates.name', 'campaignId')
            .count('campaigns_clients.client_id')
            .orderBy([
                { column: 'campaignId', order: 'desc' },
                { column: 'count', order: 'desc' },
            ])) as any) as CandidateWithVote[];

        let candidatesMapping: CandidatesMapping = {};

        for (const candidate of candidates) {
            if (!(candidate.campaignId in candidatesMapping)) {
                candidatesMapping[candidate.campaignId] = [];
            }
            candidatesMapping[candidate.campaignId].push({
                id: candidate.id,
                name: candidate.name,
                vote: candidate.count,
                youVoted: false,
            });
        }

        return campaigns.map((campaign) => ({
            ...campaign,
            candidates: candidatesMapping[campaign.id],
        }));
    };

    getCampaignsWithClient = async (clientId: number) => {
        const campaigns = await this.knex('campaigns')
            .select('id', 'name', 'from_time', 'to_time')
            .orderBy('to_time', 'desc');

        const candidates = ((await this.knex
            .select(
                'candidates.id',
                'candidates.name',
                'candidates.campaign_id as campaignId'
            )
            .from('campaigns_clients')
            .fullOuterJoin(
                'candidates',
                'candidates.id',
                'campaigns_clients.candidate_id'
            )
            .groupBy('candidates.id', 'candidates.name', 'campaignId')
            .count('campaigns_clients.client_id')
            .orderBy([
                { column: 'campaignId', order: 'desc' },
                { column: 'count', order: 'desc' },
            ])) as any) as CandidateWithVote[];

        const voteOfClient: number[] = (
            await this.knex
                .select('campaigns_clients.candidate_id as candidateId')
                .from('campaigns_clients')
                .where('campaigns_clients.client_id', clientId)
        ).map((row) => row.candidateId);

        let candidatesMapping: CandidatesMapping = {};

        for (const candidate of candidates) {
            if (!(candidate.campaignId in candidatesMapping)) {
                candidatesMapping[candidate.campaignId] = [];
            }
            candidatesMapping[candidate.campaignId].push({
                id: candidate.id,
                name: candidate.name,
                vote: candidate.count,
                youVoted: voteOfClient.includes(candidate.id),
            });
        }

        return campaigns.map((campaign) => ({
            ...campaign,
            candidates: candidatesMapping[campaign.id],
        }));
    };

    registerHKID = async (hkid: string) => {
        if (hkid === '') {
            throw new Error('Please enter HKID !');
        } else if (
            hkid.length !== 10 &&
            hkid.match(/^([A-Z]{1,2})([0-9]{6})\(([A0-9])\)$/) === null
        ) {
            throw new Error('Incorrect HKID !');
        }

        let client: Client = await this.knex('clients')
            .where('hkid', hkid)
            .select('id', 'hkid')
            .first();

        if (!client) {
            const [newClient]: Client[] = await this.knex('clients')
                .returning(['id', 'hkid'])
                .insert({ hkid: hkid });
            return newClient;
        }

        return client;
    };

    voting = async (
        campaignId: number,
        hkid: string,
        clientId: number,
        candidateId: number
    ) => {
        if (hkid === '') {
            throw new Error('Please enter HKID !');
        } else if (
            hkid.length !== 10 &&
            hkid.match(/^([A-Z]{1,2})([0-9]{6})\(([A0-9])\)$/) === null
        ) {
            throw new Error('Incorrect HKID !');
        }

        const trx = await this.knex.transaction();

        try {
            let campaign = await trx('campaigns')
                .where('id', campaignId)
                .select('from_time', 'to_time')
                .first();

            const curTime = moment();

            if (
                moment(campaign.to_time).isSameOrBefore(curTime) ||
                moment(campaign.from_time).isAfter(curTime)
            ) {
                throw new Error(
                    'Voting period error! please contact the technician.'
                );
            }

            let client: Client = await trx('clients')
                .where({
                    hkid: hkid,
                    id: clientId,
                })
                .select('id', 'hkid')
                .first();

            let alreadyVoted: CampaignClient[];

            if (!client) {
                throw new Error(
                    'Incorrect client info! please contact the technician.'
                );
            }
            alreadyVoted = await trx('campaigns_clients')
                .where({
                    campaign_id: campaignId,
                    client_id: client.id,
                })
                .first();

            if (alreadyVoted) {
                await trx.commit();
                return "You've already voted!";
            }

            await trx('campaigns_clients').insert({
                campaign_id: campaignId,
                client_id: client.id,
                candidate_id: candidateId,
            });

            console.log('[info] Transaction commit');
            await trx.commit();
            return 'Thank you for your participation! Result will be published when campaign finishes.';
        } catch (e) {
            console.error(e);
            console.log('[info]Transaction rollback');
            await trx.rollback();
            throw new Error('Failed to create');
        } finally {
            await trx.destroy();
        }
    };
}
