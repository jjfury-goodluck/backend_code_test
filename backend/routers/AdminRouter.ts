import express, { Request, Response } from "express";
import { AdminService } from '../services/AdminService'

export class AdminRouter {

    constructor(private adminService: AdminService) { }

    route() {
        const router = express.Router();
        router.get('/current', this.getCurrentUser);
        router.post('/new_campaign', this.addCampaign);
        return router;
    }

    getCurrentUser = async (req: Request, res: Response) => {
        try {
            return res.json(req.user);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Unsuccess! Please contact your technician." });
        }
    }

    addCampaign = async (req: Request, res: Response) => {
        try {
            if (req.user == null) {
                return res.status(401).json({ msg: "Unauthorized" });
            }

            const { name, to, from } = req.body

            const result = await this.adminService.addCampaign(name, from, to)

            return res.status(200).json({ msg: result });

        } catch (e) {
            console.log(e)
            return res.status(500).json({ msg: "Unsuccess! Please contact your instructor." });
        }

    }
}