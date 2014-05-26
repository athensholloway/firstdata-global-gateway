(function () {
   'use strict';
	
	var RequestBuilder = require('../../lib/RequestBuilder');
	var Sha1HmacBuilder = require('../../lib/Sha1HmacBuilder');
			
	describe('Global Gateway e4 Request Builder', function() {
		
		it('Should set the authorization HTTP header', function(){
			//Given
			var message = {name:'message',id:1};
			var now = new Date();
			var hmacKey = '_Jcn8wvSqrqKlhCUdId2Xpl5hO6bINMG';
			var hmacKeyId = '137288';
			var sha1HmacBuilder = new Sha1HmacBuilder(hmacKey);
			var requestBuilder = new RequestBuilder(hmacKeyId,hmacKey, sha1HmacBuilder)
					.withHost('api.demo.globalgatewaye4.firstdata.com')
					.withPort(443)
					.withUri('/transaction/v13')
					.withMethod('POST')
					.withHeader('Content-Type','application/json')
					.withHeader('Accept','application/json')
					.withTimeStamp(now)
					.withMessage(message);
					
			//When
			var request = requestBuilder.build();
			
			//Then
			expect(request.headers['authorization']).toBe('');
		});
		
		it('Should set the x-gge4-date HTTP header', function(){
			//Given
			var message = {name:'message',id:1};
			var now = new Date();
			var hmacKey = '_Jcn8wvSqrqKlhCUdId2Xpl5hO6bINMG';
			var hmacKeyId = '137288';
			var sha1HmacBuilder = new Sha1HmacBuilder(hmacKey);
			var requestBuilder = new RequestBuilder(hmacKeyId,hmacKey, sha1HmacBuilder)
					.withHost('api.demo.globalgatewaye4.firstdata.com')
					.withPort(443)
					.withUri('/transaction/v13')
					.withMethod('POST')
					.withHeader('Content-Type','application/json')
					.withHeader('Accept','application/json')
					.withTimeStamp(now)
					.withMessage(message);
					
			//When
			var request = requestBuilder.build();
			
			//Then
			expect(request.headers['x-gge4-date']).toBe(now.toISOString());
		});
	});
	
}());