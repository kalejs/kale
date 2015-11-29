'use strict';

const _ = require('lodash');

const index = (ctx) => {
  return ctx.models.KaleRecord.collection()
    .query(function(knex) {
      knex.limit(50).offset(0).orderBy('created_at', 'asc');
    })
    .fetch()
    .then((kaleRecords) => {
      ctx.body = {
        kaleRecords
      };
    });
};

const show = (ctx) => {
  return _fetchKaleRecord(ctx).then((kaleRecord) => {
    ctx.body = {
      kaleRecord
    };
  });
};

const create = (ctx) => {
  let params = _kaleRecordParams(ctx.request.body);
  let kaleRecord = new ctx.models.KaleRecord(params);

  return kaleRecord.save().then((kaleRecord) => {
    ctx.status = 201;
    ctx.body = {
      kaleRecord
    };
  });
};

const update = (ctx) => {
  return _fetchKaleRecord(ctx).then((kaleRecord) => {
    let params = _kaleRecordParams(ctx.request.body);

    return kaleRecord.save(params, { patch: true });
  }).then((kaleRecord) => {
    ctx.status = 200;
    ctx.body = {
      kaleRecord
    };
  });
};

const destroy = (ctx) => {
  return _fetchKaleRecord(ctx).then((kaleRecord) => {
    return kaleRecord.destroy();
  }).then(() => {
    ctx.status = 204;
  });
};

function _fetchKaleRecord(ctx) {
  return ctx.models.KaleRecord.forge({ id: ctx.params.id }).fetch({ require: true });
}

function _kaleRecordParams(body) {
  // TODO: Whitelist params for creating & updating a KaleRecord.
  return _.pick(body, '');
}

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
