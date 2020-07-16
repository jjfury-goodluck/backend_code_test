import express, { Request, Response } from "express";
import { VotingService } from '../services/VotingService'

export class VotingRouter {

    constructor(private votingService: VotingService) { }

    route() {
        const router = express.Router();
        router.get('/', this.getCampaign);
        router.post('/vote', this.voting);
        return router;
    }

    getCampaign = async (req: Request, res: Response) => {
        try {

            const campaigns = await this.votingService.getCampaign()

            return res.status(200).json({ campaigns: campaigns })
        } catch (e) {
            console.error(e);
            return res.status(500).json({ msg: "Internal server error" });
        }
    }

    voting = async (req: Request, res: Response) => {
        try {

            const msg = await this.votingService.voting(
                req.body.campaignId,
                req.body.hkid,
                req.body.candidateId
            )

            return res.json({ msg: msg });

        } catch (e) {
            console.log(e)
            return res.status(500).json({ msg: "Unsuccess! Please contact your technician." });
        }

    }
}