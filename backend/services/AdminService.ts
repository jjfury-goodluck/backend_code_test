import Knex from 'knex';
import moment from 'moment';
import 'moment-timezone';


export class AdminService {
    constructor(private knex: Knex) { }

    addCampaign = async (name: string, candidates: string, from: string, to: string) => {
        const curDateTime = moment.tz(moment(), 'Hongkong').format()
        if (from >= to || from < curDateTime) {
            return "Wrong time interval"
        }

        const candidateArray: string[] = candidates.split(',')
        const trx = await this.knex.transaction();

        try {
            const campaignId = await trx('campaigns').insert({
                name: name,
                from_time: from,
                to_time: to
            }).returning('id');

            for (let candidate of candidateArray) {
                await trx('candidates').insert({
                    name: candidate,
                    campaign_id: campaignId[0]
                })
            }

            console.log("[info] Transaction commit");
            await trx.commit();

            return "Campaign created";

        } catch (err) {
            console.error(err);

            console.log('[info]Transaction rollback');
            await trx.rollback();
            return "Failed to create"
        } finally {
            await trx.destroy();
        }

    }
}