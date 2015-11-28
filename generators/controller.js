'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
_.str = require('underscore.string');
_.str.inflection = require('inflection');

function _emptyControllerTemplate() {
  return `'use strict';

module.exports = {

};
`;
}

function _controllerTemplate(className, singular, plural) {
  return `'use strict';

const _ = require('lodash');

const index = (ctx) => {
  return ctx.models.${className}.collection()
    .query(function(knex) {
      knex.limit(50).offset(0).orderBy('created_at', 'asc');
    })
    .fetch()
    .then((${plural}) => {
      ctx.body = {
        ${plural}
      };
    });
};

const show = (ctx) => {
  return _fetch${className}(ctx).then((${singular}) => {
    ctx.body = {
      ${singular}
    };
  });
};

const create = (ctx) => {
  let params = _${singular}Params(ctx.request.body);
  let ${singular} = new ctx.models.${className}(params);

  return ${singular}.save().then((${singular}) => {
    ctx.status = 201;
    ctx.body = {
      ${singular}
    };
  });
};

const update = (ctx) => {
  return _fetch${className}(ctx).then((${singular}) => {
    let params = _${singular}Params(ctx.request.body);

    return ${singular}.save(params, { patch: true })
  }).then((${singular}) => {
    ctx.status = 200;
    ctx.body = {
      ${singular}
    };
  });
};

const destroy = (ctx) => {
  return _fetch${className}(ctx).then((${singular}) => {
    return ${singular}.destroy();
  }).then(() => {
    ctx.status = 204;
  });
};

function _fetch${className}(ctx) {
  return ctx.models.${className}.forge({ id: ctx.params.id }).fetch({ require: true });
}

function _${singular}Params(body) {
  // TODO: Whitelist params for creating & updating a ${className}.
  return _.pick(body, '');
}

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
`;
}

function _indexTemplate(dir) {
  var files = fs.readdirSync(dir);
  var requires = [];
  var template = `'use strict';

module.exports = {
[FILES]
};
`;

  _.each(files, function(file) {
    if (_.str.isBlank(file) || file === 'index.js' || _.str.startsWith(file, '.')) {
      return;
    }

    var name = file.split('.')[0];
    var camelizedName = _.str.camelize(name);
    requires.push(`  ${camelizedName}: require('./${name}'),`);
  });

  return template.replace('[FILES]', requires.join('\n'));
}

function _routerTemplate(camelized) {
  var dasherized = _.str.dasherize(camelized);

  return `
router.get('/${dasherized}', controllers.${camelized}.index);
router.get('/${dasherized}/:id', controllers.${camelized}.show);
router.post('/${dasherized}', controllers.${camelized}.create);
router.put('/${dasherized}/:id', controllers.${camelized}.update);
router.del('/${dasherized}/:id', controllers.${camelized}.destroy);
`;
}

function _writeRoutes(camelized) {
  var routesPath = path.join('.', 'app', 'routes.js');
  var template = _routerTemplate(camelized);

  var routes = fs.readFileSync(routesPath, 'utf8');
  var lines = routes.split('\n');

  var exportLine = _.findLastIndex(lines, function(text) {
    _.str.startsWith(text, 'route.all(\'*\'');
  });

  lines.splice(exportLine - 1, 0, template);

  fs.writeFileSync(routesPath, lines.join('\n'));
}


module.exports = function(plural, options) {
  var camelized = _.str.camelize(plural);
  var singular = _.str.inflection.singularize(camelized);
  var className = _.str.classify(singular);

  var controllersDir = path.join('.', 'app', 'controllers');

  var filePath = path.join(controllersDir, camelized + '.js');
  var indexPath = path.join(controllersDir, 'index.js');

  var template;

  if (options.empty) {
    template = _emptyControllerTemplate();
  } else {
    template = _controllerTemplate(className, singular, camelized);
  }

  fs.writeFileSync(filePath, template);
  fs.writeFileSync(indexPath, _indexTemplate(controllersDir));

  if (!options.empty) {
    _writeRoutes(camelized);
  }

  console.log(`${camelized} controller written to ${filePath}`);
};
