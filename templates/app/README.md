# KALE_NAME

## Installation

```
./bin/setup
```

## Running

```
npm start
```

## Config

Environment-specific files are located in `config/environments`.

For example, development config merges `environments/development.js` into `environments/all.js`.

You can also set personal config by creating a config file ending in `.local.js`, like `development.local.js`.

It is [recommended](http://12factor.net/config) to use environment variables for configuration. Locally, you can store your environment variables in the `.env` file - this file should not be committed or used in any environment but development or test.
