import Knex from 'knex';


export class AdminService {
    constructor(private knex: Knex) { }

    addCampaign = async (name: string, from: string, to: string) => {

        await this.knex('campaigns').insert({
            name: name,
            from_time: from,
            to_time: to
        })

        return "Campaign created";
    }
}