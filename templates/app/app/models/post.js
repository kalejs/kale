'use strict';

const Kale = require('kalejs');

class Post extends Kale.Model {

}

module.exports = Kale.Model.register('Post', Post);
