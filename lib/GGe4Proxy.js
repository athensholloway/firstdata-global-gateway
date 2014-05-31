(function () {
	'use strict';
	
	var Sha1HmacBuilder = require('./Sha1HmacBuilder');
	var RequestBuilder = require('./RequestBuilder');
	var ResponseCodes = require('./ResponseCodes');
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
			.withHeader('Content-Type','application/json')
			.withHeader('Accept','application/json');
	}
	
	GGe4Proxy.prototype._adaptError = function (response) {
		var result = {
			reason: ResponseCodes[response.payload.bank_resp_code] || response.payload.bank_message,
		};
		return result;
	};
	
	GGe4Proxy.prototype._adaptResponse = function (response) {
		var result = {
			authorizationNumber: response.payload.Authorization_Num,
			sequenceNumber: response.payload.SequenceNo,
			customerTransactionRecord: response.payload.SequenceNo,
			amount: response.amount,
			creditCardNumber: response.payload.cc_number, 
			creditCardExpirationDate: response.payload.cc_expiry,
			cardholderName: response.payload.cardholder_name,
			currencyCode: response.payload.currency_code
		};
		return result;
	};
	
	GGe4Proxy.prototype._isResponseSuccessful = function (response) {
		var isHttpStatusCodeSuccessful = (response.statusCode >= 200 && response.statusCode < 300);
		var isTransactionApproved = response.payload.exact_resp_code === '00' && 
			response.payload.transaction_error === 0  && 
			response.payload.transaction_approved === 1;
		return isHttpStatusCodeSuccessful && isTransactionApproved;
	};
	
	GGe4Proxy.prototype._sendRequest = function (message) {
		var deferred = Q.defer();
		var requestOptions = this.requestBuilder.withMessage(message).withTimeStamp(new Date()).build();
		var req = https.request(requestOptions, function(res){
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				var response = {
					statusCode: res.statusCode,
					headers: res.headers,
					payload:JSON.parse(chunk)
				};
				
				if(this._isResponseSuccessful(response)){
					deferred.resolve(this._adaptResponse(response));
				}else{
					deferred.reject(this._adaptError(response));
				}
			}.bind(this));
		}.bind(this));
		
		req.on('error', function(e) {
			deferred.reject(this._adaptError(e));
		}.bind(this));
		
		req.write(message);
		req.end();
		
		return deferred.promise;
	};
		
	GGe4Proxy.prototype.purchase = function (charge) {
		
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
	
	module.exports = GGe4Proxy;
	
	
})();