import Knex from 'knex';
import { User } from '../model';

export class UserService {
    constructor(private knex: Knex) {}

    getUserByUsername = async (username: string): Promise<User> => {
        const result: User = await this.knex('staffs')
            .where({
                username: username,
            })
            .first();

        return result;
    };

    getUser = async (id: number, username: string): Promise<User> => {
        const result: User = await this.knex('staffs')
            .select('id', 'username')
            .where({
                id: id,
                username: username,
            })
            .first();

        return result;
    };
}
