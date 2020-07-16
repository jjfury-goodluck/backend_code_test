import Knex from "knex";
import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import { isLoggedIn } from "./guard";
import { VotingService } from "./services/VotingService";
import { VotingRouter } from "./routers/VotingRouter";
import { AdminService } from "./services/AdminService";
import { AdminRouter } from "./routers/AdminRouter";
import { UserService } from "./services/UserService";
import { UserRouter } from "./routers/UserRouter";


const knexConfig = require('./knexfile');
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);


const votingService = new VotingService(knex);
const votingRouter = new VotingRouter(votingService);
const adminService = new AdminService(knex);
const adminRouter = new AdminRouter(adminService);
const userService = new UserService(knex);
const userRouter = new UserRouter(userService);


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors({
    origin: [
        'http://localhost:3000'
    ]
}));

app.use('/campaign', votingRouter.route());
app.use('/user', userRouter.route());
app.use('/admin', isLoggedIn(userService), adminRouter.route());

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening to port ${port}`)
});