import express, { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { checkPassword } from '../hash';
import jwt from '../jwt';
import jwtSimple from 'jwt-simple';

export class UserRouter {
    constructor(private userService: UserService) {}

    route() {
        const router = express.Router();
        router.post('/login', this.login);
        return router;
    }

    login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            const user = await this.userService.getUserByUsername(username);

            if (!user) {
                return res.status(401).json('Denied!');
            }

            const match = await checkPassword(password, user.password);

            if (match) {
                const payload = {
                    id: user.id,
                    username: user.username,
                };

                const token = jwtSimple.encode(payload, jwt.jwtSecret);

                return res.status(200).json({ token: token });
            } else {
                return res.status(401).json('Please call your technician');
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json('Internal server error');
        }
    };
}
