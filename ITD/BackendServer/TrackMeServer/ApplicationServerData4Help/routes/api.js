var express = require('express');
var router = express.Router();
var bb = require("bluebird");
var request = bb.promisify(require('request'));
var config = require('../../common/config.json');
var common = require('../../common/common');


router.post('/register', function(req, res) {
    var params = {};
    Object.keys(req.body).forEach(function (k) {
        params[k] = req.body[k].toLowerCase();
    });
    common.validateParams(params, [
        'vat',
        'name'
    ])
        .then(function() {
            return request({
                url: `http://${config.address.databaseServer}:${config.port.databaseServer}/company`,
                method: 'GET',
                qs: {
                    vat: params.vat
                }
            })
        })
        .then(function(reqres) {
            if (!reqres || reqres.statusCode !== 200 || !reqres.body) {
                return Promise.reject();
            }
            var reqdata = JSON.parse(reqres.body)[0] || '';
            if (reqdata.id) {
                return Promise.reject({apiError: `company with vat ${params.vat} already registered`});
            }
            params.apiKey = generateAPIkey();
            return request({
                url: `http://${config.address.databaseServer}:${config.port.databaseServer}/company/register`,
                method: 'POST',
                json: true,
                body: params
            })
        })
        .then(function(reqres) {
            if (!reqres || reqres.statusCode !== 200) {
                return Promise.reject();
            }
            res.status(201).send({apiKey: params.apiKey}); // success
        })
        .catch(function(err) {
            common.catchApi(err, res);
        })
});

router.post('/specificRequest', function(req, res) {
    var params = {};
    verifyApiKey(req.query.apiKey)
        .then(function(companyId) {
            params.companyId = companyId;
            Object.keys(req.body).forEach(function (k) {
                params[k] = req.body[k].toLowerCase();
            });
            return common.validateParams(params, [
                'targetSsn'
            ]);
        })
        .then(function() {
            // check that the target user exists
            return request({
                url: `http://${config.address.databaseServer}:${config.port.databaseServer}/user`,
                method: 'GET',
                qs: {
                    ssn: params.targetSsn
                }
            })
        })
        .then(function(reqres) {
            if (!reqres || reqres.statusCode !== 200 || !reqres.body) {
                return Promise.reject({apiError: `user with ssn ${params.targetSsn} does not exist in our database`});
            }
            var reqdata = JSON.parse(reqres.body)[0] || '';
            if (!reqdata.ssn) {
                return Promise.reject({apiError: `user with ssn ${params.targetSsn} does not exist in our database`});
            }
            // check that is not a duplicate request
            // todo
            // record the request
            return request({
                url: `http://${config.address.databaseServer}:${config.port.databaseServer}/request/specificRequest`,
                method: 'POST',
                json: true,
                body: params
            })
        })
        .then(function(reqres) {
            if (!reqres || reqres.statusCode !== 200 || !reqres.body || !reqres.body[0].id) {
                return Promise.reject();
            }
            res.status(201).send({apiMsg: `your specific request id is: ${reqres.body[0].id}`}); // success
        })
        .catch(function(err) {
            common.catchApi(err, res);
        })
});

router.get('/specificRequest/:id', function(req, res) { // todo change in query
    var params = {};
    verifyApiKey(req.query.apiKey)
        .then(function(companyId) {
            params.companyId = companyId;
            // todo
        })
});

router.post('/groupRequest', function(req, res) {
    var params = {};
    Object.keys(req.body).forEach(function (k) {
        if (k !== 'apiKey') {
            params[k] = req.body[k].toLowerCase();
        }
        else {
            params.apiKey = req.body.apiKey;
        }
    });
    common.validateParams(params, [
        'apiKey',
        'targetSsn'
    ])
        .then(function() {
            //todo
        })
});

function generateAPIkey() {
    // todo check duplicate
    return common.randomString(40);
}

function verifyApiKey(key) {
    return new Promise(function(resolve, reject) {
        common.validateParams({apiKey: key}, [
            'apiKey',
        ])
            .then(function() {
                return request({
                    url: `http://${config.address.databaseServer}:${config.port.databaseServer}/company`,
                    method: 'GET',
                    qs: {
                        apiKey: key
                    }
                })
            })
            .then(function(reqres) {
                if (!reqres || reqres.statusCode !== 200 || !reqres.body) {
                    return Promise.reject();
                }
                var reqdata = JSON.parse(reqres.body)[0] || '';
                if (!reqdata.id) {
                    return Promise.reject();
                }
                resolve(reqdata.id);
            })
            .catch(function(err) {
                reject({apiError: 'API key not authorized'});
            })
    });
}


module.exports = router;