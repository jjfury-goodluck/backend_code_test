# Introduction of the project

This project is a professional back-end code test offered by a company that I've applied a programmer position of it. The theme is a voting website with the features of displaying the different voting campaigns and the real-time current vote count. The front-end API is made of React, Redux, Thunk and Socket.Io-Client, and the back-end  API is made of Node.js(Typescript), Express, Knex.js, **PostgreSQL**, Socket.IO and jwt.io.

# Installation

For the setup, you should run:

### `FRONT-END`

**Note: Remember to setup .env**

cd frontend/ <br />
yarn install <br />

### `BACK-END`

**!!!Note for setup before running the below commands** <br/>
**- Recommend PostgreSQL as the database** <br/>
**- After setup of the DB, fill in the database info in .env.sample (JWT_SECRET can be revised as you like)** <br/>
**- Rename .env.sample to .env**

cd ../backend/ <br />
yarn install  <br />
yarn knex migrate:latest <br /> 
yarn knex seed:run

# Usage

To try this project locally, please go to the project folder in two separate terminals and run the below commands respectively:

### `TERMINAL ONE FOR FRONT-END`

cd frontend/ <br />
yarn start

### `TERMINAL TWO FOR BACK-END`

cd ../backend/ <br />
yarn start

**Admin** <br/>
Username: adminstaff <br/>
Password: goodluck

**Note: Press 'CTRL' + 'C' if termination**