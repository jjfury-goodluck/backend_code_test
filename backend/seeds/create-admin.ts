import * as Knex from "knex";
import { hashPassword } from "../hash";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("staffs").del();
    await knex("campaigns_clients").del();
    await knex("clients").del();
    await knex("candidates").del();
    await knex("campaigns").del();


    // Inserts seed entries
    await knex("staffs").insert([
        { username: "adminstaff", password: (await hashPassword("goodluck")) }
    ]);

    const campaign = await knex("campaigns").returning('id').insert([
        { name: "Who is the greatest player in NBA history?", from_time: new Date, to_time: new Date() }
    ]);

    const client = await knex("clients").returning('id').insert([
        { hkid: "adminstaff" },
        { hkid: "fsdfdsb" },
        { hkid: "asdfsdfsdfsd" }
    ]);

    const candidate = await knex("candidates").returning('id').insert([
        { name: "Kobe", campaign_id: campaign[0] },
        { name: "Jordan", campaign_id: campaign[0] },
        { name: "James", campaign_id: campaign[0] }
    ]);

    await knex("campaigns_clients").insert([
        { campaign_id: campaign[0], client_id: client[0], candidate_id: candidate[1] },
        { campaign_id: campaign[0], client_id: client[1], candidate_id: candidate[1] },
        { campaign_id: campaign[0], client_id: client[2], candidate_id: candidate[1] }
    ]);
};
