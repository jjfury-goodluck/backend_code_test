import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('campaigns', table => {
        table.increments();
        table.string("name").notNullable();
        table.dateTime("from_time").notNullable();
        table.dateTime("to_time").notNullable();
        table.timestamps(false, true);
    })

    await knex.schema.createTable('candidates', table => {
        table.increments();
        table.string("name").notNullable();
        table.integer('campaign_id').notNullable();
        table.foreign('campaign_id').references('campaigns.id');
        table.timestamps(false, true);
    })

    await knex.schema.createTable('campaigns_clients', table => {
        table.increments();
        table.integer('campaign_id').notNullable();
        table.foreign('campaign_id').references('campaigns.id');
        table.integer('candidate_id').notNullable();
        table.foreign('candidate_id').references('candidates.id');
        table.integer('client_id').notNullable();
        table.foreign('client_id').references('clients.id');
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("campaigns_clients");
    await knex.schema.dropTable("candidates");
    await knex.schema.dropTable("campaigns");
}
