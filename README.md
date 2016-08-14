# Kale.js

The blazing fast node.js framework for developers who deliver on time.

## What is it?

Kale.js consists of a lightweight, opinionated [framework](#framework) and several [generators](#generators) for building highly-scalable APIs and web apps with ease.

Overall, Kale.js builds apps that are fast, easy-to-read, require minimal setup, use sane defaults, and follow industry best practices.

A Kale.js application:

* Built on [koa](http://koajs.com/) and makes heavy use of ES6 Promises.
* Uses [bookshelf.js](http://bookshelfjs.org/) for an ORM.
* Backed by [Postgresql](http://www.postgresql.org/) by default.
* Includes basic single-page-app using [AngularJS](https://angularjs.org/), installed with [bower](http://bower.io/).
* Includes an asset pipeline using [Broccoli](http://broccolijs.com/) with development file watching and reload.
* Front-end javascript uses [browserify](http://browserify.org/) for node-style `require` statements.
* Sets up [Gulp](https://github.com/gulpjs/gulp) with basic [linting with jshint](https://github.com/jshint/jshint) and [code-style checking with jscs](https://github.com/jscs-dev/node-jscs)
* Front-end stylesheets are compiled with [SASS/SCSS](http://sass-lang.com/).
* Generates models with UUIDs as the primary key by default.
* Is a stateless, secure JSON API.
  * Does not include cookies or cookie-based sessions by default (so no need for CSRF protection)
* Security headers provided by [helmet](https://github.com/venables/koa-helmet), and [CORS](https://github.com/koajs/cors).
* Includes environment-specific config according to [the 12-factor app](http://12factor.net/) methodology.
* Includes a [Procfile](https://devcenter.heroku.com/articles/procfile) for easy deployment to heroku.

## Installation

```
npm install -g kalejs
```

## Framework


## Generators

Kale.js includes 6 Generators:

* one to [build an app](#usage),
* one to [build a controller](#controller-generator),
* one to [build a model](#model-generator),
* one to [build a set of views](#view-generator),
* one to [build a migration](#migration-generator), and
* one to [build scaffolding](#scaffold-generator).


## Usage

To start a new project, simply run `kale new <project_name>`, for example:

```
kale new example-app
```

This will build a new kale.js app in `./example-app`.

From the root of the new project, run `./bin/setup`, then `npm start` and you'll have a server running.

The app structure will look like:

```
app/
  assets/             <-- front-end app (Angular)
    bower_components  <-- bower-based installed assets
    images/           <-- static images
    javascripts/      <-- static js files
    stylesheets/      <-- static css (less) files
    views/            <-- static html page

  controllers/        <-- API controllers
  middleware/         <-- API middleware
  models/             <-- Bookshelf models

  index.js            <-- app entry point
  routes.js           <-- API routes

bin/                  <-- binary files

config/               <-- app config
  environments/       <-- environment specific config

db/                   <-- database config, initialization
  migrations/         <-- database migrations

public/               <-- static/public files live here
  assets/             <-- asset pipeline compiles app/assets to this directory

test/                 <-- tests
```

## Generators

Kale.js comes equipped with a several generators to speed up development:

### Model Generator

```
kale generate model Thing
```

This will create a new `Thing` model (referencing a `things` table) named `thing.js` in the `app/models` directory.

This will also create an empty migration named `<timestamp>_create_things.js` in the `db/migrations` directory.

### Controller Generator

```
kale generate controller users
```

This will create a new RESTful controller named `users` in the `app/controllers` directory.

The controller contains `index`, `show`, `create`, `update`, and `destroy` methods, as well as their routes.

### View Generator

```
kale generate view users
```

This will create a new set of AngularJS views under `/users` in `app/assets/views` and `app/assets/javascripts`.

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
kale migrate
npm start
```
