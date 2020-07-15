import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('clients', table => {
        table.increments();
        table.string("hkid").notNullable();
        table.timestamps(false, true);
    })

    await knex.schema.createTable('staffs', table => {
        table.increments();
        table.string("username").notNullable();
        table.string("password").notNullable();
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("clients");
    await knex.schema.dropTable("staffs");
}

