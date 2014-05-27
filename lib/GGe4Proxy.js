(function () {
	'use strict';
	
	var Sha1HmacBuilder = require('./Sha1HmacBuilder');
	var RequestBuilder = require('./RequestBuilder');
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
			.withHeader('Content-Type','application/json')
			.withHeader('Accept','application/json');
	}
	
	GGe4Proxy.prototype._adaptError = function (error) {
		
	};
	
	GGe4Proxy.prototype._sendRequest = function (message) {
		var deferred  = q.defer();
		var requestOptions = this.requestBuilder.withMessage(message).withTimeStamp(new Date()).build();
		var req = https.request(requestOptions, function(res){
			console.log('STATUS: ' + res.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log('BODY: ' + chunk);
			});
		});
		
		req.on('error', function(e) {
			deferred.reject(this._adaptError(e));
		});
		
		req.write(message);
		req.end();
		
		return deferred.promise();
	};
		
	GGe4Proxy.prototype.purchase = function (charge) {
		
		//this.chargeValidator.validate(charge);
		
		var message = JSON.stringify({
			gateway_id: this.gatewayId,
			password: this.password,
			transaction_type: PURCHASE_TRANSACTION_TYPE,
			amount: charge.amount,
			cc_number: charge.creditCard.number,
			cc_expiry: charge.creditCard.expirationMonth + charge.creditCard.expirationYear,
			cardholder_name: charge.creditCard.name
		});

		return this._sendRequest(message);
		
	};
	
})();