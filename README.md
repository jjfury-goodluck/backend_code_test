## Available Scripts

For the setup, you should run:

### `FRONTEND`

**Note: Remember to setup .env**

cd frontend/
yarn install
yarn start

### `BACKEND`

**Note: Remember to setup .env, SQL, knexfile.ts**

cd ../backend/
yarn install 
yarn knex migrate:latest 
yarn knex seed:run
node .