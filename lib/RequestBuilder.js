(function () {
	'use strict';
	
	var Sha1HmacBuilder  = require('./Sha1HmacBuilder');
	var crypto = require('crypto');
	
	function calculateSha1HexDigest (message) {
		var shasum = crypto.createHash('sha1');
		shasum.update(message);
		return shasum.digest('hex');
	}
	
	function calculateSha1Hmac (config) {
		return new Sha1HmacBuilder(config.hmacKey)
			.withContentType(config.contentType)
			.withRequestMethod(config.method)
			.withContentDigest(config.messageDigest)
			.withSendingTime(config.sendingTime)
			.withRequestUrl(config.uri)
			.build();
	}
	
	function RequestBuilder(hmacKeyId, hmacKey){
		this.hmacKeyId = hmacKeyId;
		this.hmacKey = hmacKey;
	}
	
	RequestBuilder.prototype.withHost = function (host) {
		this.host = host;
		return this;
	};
	
	RequestBuilder.prototype.withTimeStamp = function (timeStamp) {
		this.timeStamp = timeStamp;
		return this;
	};
	
	RequestBuilder.prototype.withPort = function (port) {
		this.port = port;
		return this;
	};
	
	RequestBuilder.prototype.withUri = function (uri) {
		this.uri = uri;
		return this;
	};
	
	RequestBuilder.prototype.withMethod = function (method) {
		this.method = method;
		return this;
	};
	
	RequestBuilder.prototype.withMessage = function (message) {
		this.message = message;
		this.withHeader('Content-Length', message.length);
		return this;
	};
	
	RequestBuilder.prototype.withHeader = function (key, value) {
		this.headers = this.headers || {};
		this.headers[key]=value;
		return this;
	};
	
	RequestBuilder.prototype.build = function () {
		
		var timeStamp = this.timeStamp.toISOString();
		var messageDigest = calculateSha1HexDigest(JSON.stringify(this.message));
		var sha1Hmac = calculateSha1Hmac({
			hmacKey: this.hmacKey,
			contentType: this.headers['Content-Type'],
			method: this.method,
			messageDigest: messageDigest,
			sendingTime: timeStamp,
			uri:this.uri
		});

		this.withHeader('authorization', 'GGE4_API '+this.hmacKeyId+':'+sha1Hmac);
		this.withHeader('x-gge4-date', timeStamp);
		this.withHeader('x-gge4-content-sha1', messageDigest);
		
		return {
			host: this.host,
			path: this.uri,
			port: this.port,
			method: this.method,
			headers: this.headers
		};
	};
	
	module.exports = RequestBuilder;
	
})();