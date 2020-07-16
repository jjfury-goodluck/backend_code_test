import { Bearer } from "permit";
import express from "express";
import jwtSimple from "jwt-simple";
import jwt from "./jwt";
import { UserService } from "./services/UserService";
import { User } from './model';

const permit = new Bearer({
    query: "access_token"
})

export function isLoggedIn(userService: UserService) {

    return async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const token = permit.check(req);
            if (!token) {
                return res.status(401).json({ msg: "Permission Denied! Please login again." });
            }
            const payload = jwtSimple.decode(token, jwt.jwtSecret);
            const user: User = await userService.getUser(payload.id, payload.username);
            if (user) {
                req.user = user;
                return next();
            } else {
                return res.status(401).json({ msg: "Permission Denied! Please contact your instructor." });
            }
        } catch (e) {
            return res.status(401).json({ msg: "Permission Denied! Server error." });
        }
    }
}