# Server

This projet is the server for all websites of **insamee-app**.

## Tech Stack

**Server:** Adonisjs, Postgresql

## Installation

This project uses `npm`.

```bash
# install dependencies
npm i

# start un dev mode the project
npm run dev

# build the project
npm run build

# start in production mode the project
npm run start
```

Before to start, you must create tables in your database:

```bash
node ace migration:run
```

Then, you can populate your database:

```bash
node ace db:seed
```

In order to be used this server with any of the front-end, you must create a `.evn` file using the `.env.example` template.

## Authors

- [@barbapapazes](https://www.github.com/barbapapazes)
