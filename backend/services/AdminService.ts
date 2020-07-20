import Knex from 'knex';
import moment from 'moment';

export class AdminService {
    constructor(private knex: Knex) {}

    addCampaign = async (
        name: string,
        candidates: string,
        from: string,
        to: string
    ) => {
        const curDateTime = moment();
        if (
            moment(from).isSameOrAfter(to) ||
            moment(from).isBefore(curDateTime)
        ) {
            throw new Error('Wrong time interval');
        }

        const candidateArray: string[] = candidates.split(',');
        const trx = await this.knex.transaction();

        try {
            const [campaignId] = await trx('campaigns')
                .insert({
                    name: name,
                    from_time: from,
                    to_time: to,
                })
                .returning('id');

            for (let candidate of candidateArray) {
                await trx('candidates').insert({
                    name: candidate,
                    campaign_id: campaignId,
                });
            }

            console.log('[info] Transaction commit');
            await trx.commit();
            return 'Campaign created';
        } catch (err) {
            console.error(err);
            console.log('[info]Transaction rollback');
            await trx.rollback();
            throw new Error('Failed to create');
        } finally {
            await trx.destroy();
        }
    };
}
