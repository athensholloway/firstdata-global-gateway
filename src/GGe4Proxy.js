(function () {
    'use strict';

    var Sha1HmacBuilder = require('./Sha1HmacBuilder');
    var RequestBuilder = require('./RequestBuilder');
    var FirstDataResponse = require('./FirstDataResponse');
    var https = require('https');
    var Q = require('q');

    var PURCHASE_TRANSACTION_TYPE = '00';

    function GGe4Proxy(config) {

        this.gatewayId = config.gatewayId;
        this.password = config.password;

        //move these details  to the base class
        this.requestBuilder = new RequestBuilder(new Sha1HmacBuilder(config.hmacKey))
            .withHmacKeyId(config.hmacKeyId)
            .withHost(config.serviceEndPoint)
            .withPort(443)
            .withUri(config.serviceUri)
            .withMethod('POST')
            .withHeader('Content-Type', 'application/json')
            .withHeader('Accept', 'application/json');
    }

    GGe4Proxy.prototype._sendRequest = function (message) {
        var deferred = Q.defer();
        var requestOptions = this.requestBuilder.withMessage(message).withTimeStamp(new Date()).build();
        var self = this;

        var callback = function (res) {
            var payload = '';

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                payload += chunk;
            });

            res.on('end', function () {
                try {
                    var text = payload && payload.replace(/^\s*|\s*$/g, '');
                    res.payload = text && JSON.parse(text);
                } catch (e) {
                    console.log(e);
                }

                var firstDataResponse = new FirstDataResponse(res);

                if (firstDataResponse.ok()) {
                    deferred.resolve(firstDataResponse.getTransaction());
                } else {
                    deferred.reject(firstDataResponse.getError());
                }
            });
        };

        var req = https.request(requestOptions, callback);

        req.setTimeout(5000, function () {
            req.abort();
        });

        req.on('error', function (e) {
            console.log(e);
            deferred.reject(this._adaptError(e));
        }.bind(this));

        req.write(message);
        req.end();

        return deferred.promise;
    };

    GGe4Proxy.prototype.purchase = function (charge) {

        var message = JSON.stringify({
            gateway_id:           this.gatewayId,
            password:             this.password,
            transaction_type:     PURCHASE_TRANSACTION_TYPE,
            amount:               charge.amount,
            cc_number:            charge.creditCard.number,
            cc_expiry:            charge.creditCard.expirationMonth + charge.creditCard.expirationYear,
            cardholder_name:      charge.creditCard.name,
            cc_verification_str2: charge.creditCard.securityCode,
            cvd_presence_ind:     '1'

        });

        return this._sendRequest(message);
    };

    module.exports = GGe4Proxy;

})();