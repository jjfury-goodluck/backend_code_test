## Available Scripts

For the setup, you should run:

### `FRONTEND`

**Note: Remember to setup .env**

cd frontend/ <br />
yarn install <br />
yarn start

### `BACKEND`

**Note: Remember to setup .env, SQL, knexfile.ts**

cd ../backend/ <br />
yarn install  <br />
yarn knex migrate:latest <br /> 
yarn knex seed:run <br />
node .