# kale.js

The node.js framework for developers who deliver.

## What is it?

Kale.js is a set of lightweight, opinionated generators for building koa-based node.js APIs with ease.

Kale.js consists of 5 Generators. One to [build an app](#usage), one to [build a controller](#controller-generator), one to [build a model](#model-generator), one to [build a migration](#migration-generator), and one to [build scaffolding](#scaffold-generator).

A Kale.js application:

* Built on [koa](http://koajs.com/) and makes heavy use of ES6 Generators.
* Uses [bookshelf.js](http://bookshelfjs.org/) for object Models.
* Backed by [Postgresql](http://www.postgresql.org/) by default.
* Generates models with UUIDs as the primary key by default.
* Makes authentication simple and secure by using [bookshelf-secure-password](https://github.com/venables/bookshelf-secure-password).
  * Simply add `hasSecurePassword: true` to your model.
* Is a stateless, secure JSON API with [helmet](https://github.com/helmetjs/helmet) secure headers included by default.
* Does not include cookies or session support by default (so no need for CSRF protection)
* Includes environment-specific config according to [the 12-factor app](http://12factor.net/) methodology.
* Includes a [Procfile](https://devcenter.heroku.com/articles/procfile) for easy deployment.
* Sets up [Gulp](https://github.com/gulpjs/gulp) with basic [linting with jshint](https://github.com/jshint/jshint) and [code-style checking with jscs](https://github.com/jscs-dev/node-jscs)

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

This will create a new `User` model (referencing a `users` table) named `user.js` in the `app/models` directory.

This will also create an empty migration named `<timestamp>_create_users.js` in the `db/migrations` directory.

### Controller Generator

```
kale generate controller users
```

This will create a new RESTful controller named `users` in the `app/controllers` directory.

The controller contains `index`, `show`, `create`, `update`, and `destroy` methods, as well as their routes.

### Migration Generator

```
kale generate migration create_users
```

This will create a new migration named `<timestamp>_create_users.js` in `db/migrations` directory.


### Scaffold Generator

```
kale generate scaffold User
```

This will run the model, migration and controller generators for a new `User` model.

## Examples

To generate a simple Blog API, type the following:

```
npm install -g kalejs
kale new blog
cd blog
./bin/setup
kale generate scaffold Posts
npm start
```
