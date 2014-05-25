/*
 * The key used for the HMAC calculation can be 
 * obtained through the Realtime Payment Manager 
 * interface when using a Merchant Administrator 
 * account.
 * username: logic54
 * password: rOHR050189k2MVE
 */

https://firstdata.zendesk.com/entries/407651-Using-test-credit-card-numbers

var VisaCard = {
	name:'Test Customer',
	number:'4111111111111111',
	expirationMonth:'06',
	expirationYear:'18'
}

var proxyConfig = {
	hmacKey: '_Jcn8wvSqrqKlhCUdId2Xpl5hO6bINMG',
	hmacKeyId: '137288',
	serviceUri: '/transaction/v13',
	serviceEndPoint: 'api.demo.globalgatewaye4.firstdata.com',
	gatewayId: 'AF0663-05', //gateway ID identifies the merchant and terminal under which the transaction is to be processed
	password: '452q7pob' //authenticates the GGe$ web service API request
};

var charge = {
	amount:100.00,
	creditCard: VisaCard
};

function StringBuilder () {this.value = '';}
StringBuilder.prototype.append = function (value) {this.value += value;}
StringBuilder.prototype.toString = function () {return this.value;}

function Sha1HmacBuilder(hmacKey){
	this.crypto = require('crypto');
	this.hmacKey = hmacKey;
}
Sha1HmacBuilder.prototype.withContentType = function (contentType) {this.contentType = contentType; return this;};
Sha1HmacBuilder.prototype.withRequestMethod = function (requestMethod) {this.requestMethod = requestMethod; return this;};
Sha1HmacBuilder.prototype.withContentDigest = function (contentDigest) {this.contentDigest = contentDigest; return this;};
Sha1HmacBuilder.prototype.withSendingTime = function (sendingTime) {this.sendingTime = sendingTime; return this;};
Sha1HmacBuilder.prototype.withRequestUrl = function (requestUrl) {this.requestUrl = requestUrl; return this;};
Sha1HmacBuilder.prototype.buildDigest = function () {
	var messageBuilder = new StringBuilder();
	//console.log('HMAC KEY: ' + this.hmacKey);
	//var sha1Hmac = this.crypto.createHmac('sha1', this.hmacKey)
	//sha1Hmac.setEncoding('binary');
	
	messageBuilder.append(this.requestMethod);
	messageBuilder.append('\n');
	messageBuilder.append(this.contentType);
	messageBuilder.append('\n');
	messageBuilder.append(this.contentDigest);
	messageBuilder.append('\n');
	messageBuilder.append(this.sendingTime);
	messageBuilder.append('\n');
	messageBuilder.append(this.requestUrl);
	
	//console.log("SHA-1 PLAIN TEXT MESSAGE: \n***************\n" + messageBuilder.toString() + "\n****************");
	
	//sha1Hmac.update(messageBuilder.toString());
	//sha1Hmac.write(messageBuilder.toString());
	//sha1Hmac.end()
	
	//return new Buffer(sha1Hmac.digest('binary')).toString('base64');
	//return new Buffer(sha1Hmac.read()).toString('base64');
	//return sha1Hmac.digest('base64');
	var digestBuffer = this.crypto.createHmac('sha1', this.hmacKey).update(messageBuilder.toString()).digest();  //.digest('binary') is not the same as .digest();
	return new Buffer(digestBuffer).toString('base64');
};

function GGe4Proxy(config, https) {
	this.https = https;
	this.crypto = require('crypto');
	this.hmacKey = config.hmacKey;
	this.hmacKeyId = config.hmacKeyId;
	this.gatewayId = config.gatewayId;
	this.password = config.password;
	this.requestOptions = {
		host: config.serviceEndPoint,
		port: 443,
		path: config.serviceUri,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	};
	//console.log(config);
	//console.log(this.requestOptions);
};
GGe4Proxy.prototype._calculateSha1HexDigest = function (message) {
	var shasum = this.crypto.createHash('sha1');
	shasum.update(message);
	return shasum.digest('hex');
};
GGe4Proxy.prototype._calculateSha1Hmac = function (messageDigest, now) {
	return new Sha1HmacBuilder(this.hmacKey)
		.withContentType(this.requestOptions.headers['Content-Type'])
		.withRequestMethod(this.requestOptions.method)
		.withContentDigest(messageDigest)
		.withSendingTime(now)
		.withRequestUrl(this.requestOptions.path)
		.buildDigest();
};
GGe4Proxy.prototype.purchase = function (charge) {
	var message = JSON.stringify({
		gateway_id: this.gatewayId,
		password: this.password,
		transaction_type: '00', //Purchase
		amount: charge.amount, //validate highest dollar amount https://firstdata.zendesk.com/entries/20730816-what-is-the-highest-transaction-amount-allowed-within-gge4
		cc_number: charge.creditCard.number,
		cc_expiry: charge.creditCard.expirationMonth + charge.creditCard.expirationYear, // format mmyy
		cardholder_name: charge.creditCard.name//, //The following characters will be stripped from this field: ; ` " / % as well as -- (2 consecutive dashes).
		//currency_code: 'USD', //https://firstdata.zendesk.com/entries/450214-supported-currencies
		//ecommerce_flag: '7', //https://firstdata.zendesk.com/entries/21531261-ecommerce-flag-values
	});
	
	//console.log(charge);
	console.log('MESSAGE: \n'+message); //testable!!!
	
	var messageDigest = this._calculateSha1HexDigest(message);
	var now = new Date().toISOString();//2014-05-24T12:27:02Z
	//var now = '2014-05-24T14:00:30Z';
	var sha1Hmac = this._calculateSha1Hmac(messageDigest, now);
	
	//console.log('MESSAGE DIGEST: \n'+messageDigest); //testable!!
	
	console.log(messageDigest === 'e8d591e4c15cc0dcba0c916299cbaf91da65c9d3');
	
	//console.log('SHA-1 HMAC: \n'+sha1Hmac); //testable!!
	console.log(sha1Hmac === 'JfaDjH45G3dXB7yEW6zhAjvXvuE=');
	
	this.requestOptions.headers['Content-Length'] = message.length;
	this.requestOptions.headers['authorization'] = 'GGE4_API '+this.hmacKeyId+':'+sha1Hmac;
	this.requestOptions.headers['x-gge4-date'] = now;
	this.requestOptions.headers['x-gge4-content-sha1'] = messageDigest;
	
	console.log(this.requestOptions);
	
	var req = this.https.request(this.requestOptions, function(res){
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});
	});
	
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	
	// write data to request body
	req.write(message);
	req.end();
};



transactionGatewayCodes = {
	'00': 'Transaction Normal',
	
}

var https = require('https');
var proxy = new GGe4Proxy(proxyConfig, https);
proxy.purchase(charge);

//check transaction_error
//if not 00 then throw exception
//if transaction_error === '00' && transaction_approved (true or 1) && exact_resp_code === '00'
//exact_message explains the reponse 
//save the bank respo code and bank message for reporting
//exact_resp_code and exact_message for reporting
//Authorization_Num
//codes documented at https://firstdata.zendesk.com/entries/451980-ecommerce-response-codes-etg-codes

//!!!! MUST DISPLAY THE CTR !!!

