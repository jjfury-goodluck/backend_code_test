import * as Knex from 'knex';
import moment from 'moment';
import { hashPassword } from '../hash';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('staffs').del();
    await knex('campaigns_clients').del();
    await knex('clients').del();
    await knex('candidates').del();
    await knex('campaigns').del();

    // Inserts seed entries
    const curDateTime = moment().format();
    const oneDayAfter = moment().add(1, 'days').format();
    const twoDayAfter = moment().add(2, 'days').format();
    const oneDayBefore = moment().subtract(1, 'days').format();

    await knex('staffs').insert([
        { username: 'adminstaff', password: await hashPassword('goodluck') },
    ]);

    const campaign = await knex('campaigns')
        .returning('id')
        .insert([
            {
                name: 'Who is the best NBA player in the history?',
                from_time: oneDayBefore,
                to_time: oneDayBefore,
            },
            {
                name: 'Which HK CEO candidate you are preferred?',
                from_time: curDateTime,
                to_time: oneDayAfter,
            },
            {
                name: 'Which animal you like?',
                from_time: oneDayAfter,
                to_time: twoDayAfter,
            },
        ]);

    const client = await knex('clients')
        .returning('id')
        .insert([
            { hkid: 'A123456(7)' },
            { hkid: 'A135791(1)' },
            { hkid: 'A246810(A)' },
            { hkid: 'A135491(4)' },
            { hkid: 'A235731(4)' },
            { hkid: 'A132331(0)' },
            { hkid: 'A135731(2)' },
            { hkid: 'A135551(3)' },
            { hkid: 'B135791(1)' },
            { hkid: 'C135791(1)' },
        ]);

    const candidate = await knex('candidates')
        .returning('id')
        .insert([
            { name: 'Kobe Bryant', campaign_id: campaign[0] },
            { name: 'Michael Jordan', campaign_id: campaign[0] },
            { name: 'Lebron James', campaign_id: campaign[0] },
            { name: 'Stephen Curry', campaign_id: campaign[0] },
            { name: 'Carrie Lam', campaign_id: campaign[1] },
            { name: 'John Tsang', campaign_id: campaign[1] },
            { name: 'Rebecca Ip', campaign_id: campaign[1] },
            { name: 'Bird', campaign_id: campaign[2] },
            { name: 'Cat', campaign_id: campaign[2] },
            { name: 'Dog', campaign_id: campaign[2] },
        ]);

    await knex('campaigns_clients').insert([
        {
            campaign_id: campaign[0],
            client_id: client[0],
            candidate_id: candidate[1],
        },
        {
            campaign_id: campaign[0],
            client_id: client[1],
            candidate_id: candidate[0],
        },
        {
            campaign_id: campaign[0],
            client_id: client[2],
            candidate_id: candidate[1],
        },
        {
            campaign_id: campaign[0],
            client_id: client[3],
            candidate_id: candidate[1],
        },
        {
            campaign_id: campaign[0],
            client_id: client[4],
            candidate_id: candidate[2],
        },
        {
            campaign_id: campaign[0],
            client_id: client[5],
            candidate_id: candidate[1],
        },
        {
            campaign_id: campaign[0],
            client_id: client[6],
            candidate_id: candidate[1],
        },
        {
            campaign_id: campaign[0],
            client_id: client[7],
            candidate_id: candidate[3],
        },
        {
            campaign_id: campaign[0],
            client_id: client[8],
            candidate_id: candidate[2],
        },
        {
            campaign_id: campaign[0],
            client_id: client[9],
            candidate_id: candidate[3],
        },
        {
            campaign_id: campaign[1],
            client_id: client[0],
            candidate_id: candidate[4],
        },
        {
            campaign_id: campaign[1],
            client_id: client[1],
            candidate_id: candidate[4],
        },
        {
            campaign_id: campaign[1],
            client_id: client[2],
            candidate_id: candidate[5],
        },
        {
            campaign_id: campaign[1],
            client_id: client[3],
            candidate_id: candidate[4],
        },
        {
            campaign_id: campaign[1],
            client_id: client[4],
            candidate_id: candidate[6],
        },
        {
            campaign_id: campaign[1],
            client_id: client[5],
            candidate_id: candidate[4],
        },
        {
            campaign_id: campaign[1],
            client_id: client[6],
            candidate_id: candidate[5],
        },
        {
            campaign_id: campaign[1],
            client_id: client[7],
            candidate_id: candidate[4],
        },
        {
            campaign_id: campaign[1],
            client_id: client[8],
            candidate_id: candidate[6],
        },
        {
            campaign_id: campaign[1],
            client_id: client[9],
            candidate_id: candidate[5],
        },
    ]);
}
