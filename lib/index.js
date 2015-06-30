"use strict";
var Promise = require('bluebird');
var _ = require('lodash');
var table = require('./table.js');
var tableGroup = require('./table-group.js');
var column = require('./column.js');
var queries = require('./queries.js');
var helpers = require('./helpers.js');

function Dboa(dbConfig){
    var _this = this;
    _this.knex = require('knex')(dbConfig);

    _this.column = helpers.wrapAll(_this.knex,column);
    _this.column.queries = helpers.wrapAll(_this.knex,queries.column);

    _this.table = helpers.wrapAll(_this.knex,table);
    _this.table.queries = helpers.wrapAll(_this.knex,queries.table);

    _this.tableGroup = helpers.wrapAll(_this.knex,tableGroup);

    _this.utils = helpers.wrapAll(_this.knex,queries.utils);
}


module.exports = function(dbConfig){
    return new Dboa(dbConfig);
};