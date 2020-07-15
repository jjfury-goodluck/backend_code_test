import Knex from 'knex';
import { User } from '../model'


export class UserService {
    constructor(private knex: Knex) { }

    getUserByUsername = async (username: string): Promise<User> => {

        const result: User[] = await this.knex('staffs').where({
            username: username
        });

        return result[0];
    }

    getUser = async (id: number, username: string): Promise<User> => {

        const result: User[] = await this.knex('staffs').select(
            'id',
            'username'
        ).where({
            id: id,
            username: username
        });

        return result[0];
    }
}