import express, { Request, Response } from 'express';
import SocketIO from 'socket.io';
import { VotingService } from '../services/VotingService';

export class VotingRouter {
    constructor(
        private votingService: VotingService,
        private io: SocketIO.Server
    ) {}

    route() {
        const router = express.Router();
        router.get('/', this.getCampaigns);
        router.post('/', this.getCampaignsWithClient);
        router.post('/vote', this.voting);
        router.post('/hkid', this.registerHKID);
        return router;
    }

    getCampaigns = async (req: Request, res: Response) => {
        try {
            const campaigns = await this.votingService.getCampaigns();

            return res.status(200).json({ campaigns: campaigns });
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({ msg: 'Unsuccess! Please contact your technician.' });
        }
    };

    getCampaignsWithClient = async (req: Request, res: Response) => {
        try {
            const campaigns = await this.votingService.getCampaignsWithClient(
                req.body.clientId
            );
            return res.status(200).json({ campaigns: campaigns });
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({ msg: 'Unsuccess! Please contact your technician.' });
        }
    };

    registerHKID = async (req: Request, res: Response) => {
        try {
            const client = await this.votingService.registerHKID(req.body.hkid);

            return res.status(200).json({ client: client, msg: 'Registered!' });
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({ msg: 'Unsuccess! Please contact your technician.' });
        }
    };

    voting = async (req: Request, res: Response) => {
        try {
            const msg = await this.votingService.voting(
                req.body.campaignId,
                req.body.hkid,
                req.body.clientId,
                req.body.candidateId
            );

            this.io.emit('new_vote');

            return res.status(200).json({ msg: msg });
        } catch (e) {
            console.log(e);
            return res
                .status(500)
                .json({ msg: 'Unsuccess! Please contact your technician.' });
        }
    };
}
