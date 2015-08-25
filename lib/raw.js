var _ = require('lodash');
var helpers = require("./helpers.js");

//range, n
exports.selectRandomInts = function(args){
    return _.template(
        'SELECT (TRUNC(RANDOM() * <%= range %> + 1)) FROM GENERATE_SERIES(0,<%= n %>);'
    )(args);
};

//fq_table_name, column_names
exports.colsToJsonb = function(args){
    return _.template(
        'json_build_object( <%= _.flatten(_.map(column_names, function(c){ return [sq(c),qu(fq_table_name + "." + c)]})).join(",") %> )::jsonb'
    ,{imports:{qu:helpers.quoteDotSep,sq:helpers.singleQuote}})(args);
}

//args: fq_table_name, partition_column_name, partitioning_column_name
exports.updatePartitionColumn = function(args){
    return  _.template(
        'UPDATE <%= qu(fq_table_name) %> AS "t1" \n' +
        'SET <%= qu(partition_column_name) %> = "t2".<%= qu(partition_column_name) %> \n' +
        'FROM(\n' +
        'SELECT <%= qu(partitioning_column_name) %>, DENSE_RANK() OVER (ORDER BY <%= qu(partitioning_column_name) %>) <%= qu(partition_column_name) %> \n' +
        'FROM <%= qu(fq_table_name) %> \n' +
        ') AS "t2" \n' +
        'WHERE "t1".<%= qu(partitioning_column_name) %> = "t2".<%= qu(partitioning_column_name) %> \n' +
        'OR ("t1".<%= qu(partitioning_column_name) %> IS NULL AND "t2".<%= qu(partitioning_column_name) %> IS NULL);'
    ,{imports:{qu:helpers.quoteDotSep}})(args);
};