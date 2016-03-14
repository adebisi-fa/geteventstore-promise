var debug = require('debug')('geteventstore:removeProjection'),
    url = require('url'),
    req = require('request-promise');

module.exports = function(config) {
    var buildUrl = function(name) {
        var urlObj = JSON.parse(JSON.stringify(config.http));
        urlObj.pathname = '/projection/' + name;
        return url.format(urlObj);
    };

    return function(name, deleteCheckpointStream, deleteStateStream) {
        deleteCheckpointStream = deleteCheckpointStream || false;
        deleteStateStream = deleteStateStream || false;

        var options = {
            uri: buildUrl(name),
            method: 'DELETE',
            qs: {
                deleteCheckpointStream: deleteCheckpointStream ? 'yes' : 'no',
                deleteStateStream: deleteStateStream ? 'yes' : 'no'
            }
        };

        debug('Options', options);
        return req(options).then(function(response) {
            debug('Response', response);
            return JSON.parse(response);
        });
    };
};