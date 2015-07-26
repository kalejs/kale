# kale.js

The node.js framework for developers who deliver.

## What is it?

## Installation

```
npm install -g kalejs
```

## Usage

To start a new project, simply run `kale new <project_name>`, for example:

```
kale new example-app
```

This will build a new kale.js app in `./example-app`.

From the root of the new project, run `./bin/setup`, then `npm start` and you'll have a server running.


## Generators

kale.js comes equipped with a several generators to speed up development:

### Model Generator

```
kale generate model User
```

This will create a new `User` model (referencing a `users` table) named `user.js` in the `src/models` directory.

This will also create an empty migration named `<timestamp>_create_users.js` in the `src/db/migrate` directory.

### Controller Generator

```
kale generate controller users
```

This will create a new RESTful controller named `users` in the `src/controllers` directory.

The controller contains `index`, `show`, `create`, `update`, and `destroy` methods, as well as their routes.

### Migration Generator

```
kale generate migration create_users
```

This will create a new migration named `<timestamp>_create_users.js` in `src/db/migrate` directory.


### Scaffold Generator

```
kale generate scaffold User
```

This will run the model, migration and controller generators for a new `User` model.
