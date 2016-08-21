'use strict';

const Kale = require('kalejs');
const _ = require('lodash');

class KaleRecordsController extends Kale.Controller {

  index() {
    return this.ctx.models.KaleRecord.collection()
      .query(function(knex) {
        knex.limit(50).offset(0).orderBy('created_at', 'asc');
      })
      .fetch()
      .then((kaleRecords) => {
        this.ctx.body = {
          kaleRecords
        };
      });
  }

  show() {
    return this._fetchKaleRecord(this.ctx.params.id).then((kaleRecord) => {
      this.ctx.body = {
        kaleRecord
      };
    });
  }

  create() {
    let params = this._kaleRecordParams();
    let kaleRecord = new this.ctx.models.KaleRecord(params);

    return kaleRecord.save().then((kaleRecord) => {
      this.ctx.status = 201;
      this.ctx.body = {
        kaleRecord
      };
    });
  }

  update() {
    return this._fetchKaleRecord(this.ctx.params.id).then((kaleRecord) => {
      let params = this._kaleRecordParams();

      return kaleRecord.save(params, { patch: true });
    }).then((kaleRecord) => {
      this.ctx.status = 200;
      this.ctx.body = {
        kaleRecord
      };
    });
  }

  destroy() {
    return this._fetchKaleRecord(this.ctx.params.id).then((kaleRecord) => {
      return kaleRecord.destroy();
    }).then(() => {
      this.ctx.status = 204;
    });
  }

  /**
   * Private
   */

  _fetchKaleRecord(id) {
    return this.ctx.models.KaleRecord.forge({ id: id }).fetch({ require: true });
  }

  _kaleRecordParams() {
    // TODO: Whitelist params for creating & updating a KaleRecord.
    return _.pick(this.ctx.request.body, '');
  }
}

module.exports = KaleRecordsController;

