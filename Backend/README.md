# emps-api

## Environments

The following table explains the branches for different environments of akt-admin-console

| Branch Name | Purpose                                                                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| develop     | This is where features are approved and reviewed here before being selected to go into the release branch a few days before a regular release. |
| master      | Production environment.                                                                                                                        |

## Development

You must install [Node.js](https://nodejs.org/). The suggested method is with [nvm](https://github.com/creationix/nvm).
The `.nvmrc` file specifies the node version used by the console. Install it by running `nvm install`. Switch versions with `nvm use`.

After you have node, you must install the project dependencies. We use [Yarn](https://yarnpkg.org/) to manage node dependencies.
Do this by running `yarn install`. If you already had dependencies installed and it gives you any errors,
you may try deleting your `node_modules` folder and try running `yarn install` again.

### Running Preparation

We need to set up husky to hook to run lint

```
yarn prepare
```

### Running Migrations

We haven't inserted anything into the database. Now to actually create that table in database you need to run migration command.

```
NODE_ENV=development yarn db:migrate
```

### Running Seeds

To do that we need to run a simple command.

```
NODE_ENV=development yarn db:seed
```

This will execute that seed files under `seeders/*.js`. Reference [Sequelize#migrations](https://sequelize.org/v5/manual/migrations.html) to know details.

To start your application in the dev profile, simply run:

```
yarn start
```

## Testing

Those tests can be run using `yarn test`.
