(function () {
   'use strict';
	describe('Global Gateway e4 Request Builder', function() {
		var RequestBuilder = require('../../src/RequestBuilder');
		var sha1HmacBuilderSpy = {};
		
		sha1HmacBuilderSpy.withContentType = jasmine.createSpy('withContentType').andReturn(sha1HmacBuilderSpy);
		sha1HmacBuilderSpy.withRequestMethod = jasmine.createSpy('withRequestMethod').andReturn(sha1HmacBuilderSpy);
		sha1HmacBuilderSpy.withContentDigest = jasmine.createSpy('withContentDigest').andReturn(sha1HmacBuilderSpy);
		sha1HmacBuilderSpy.withSendingTime = jasmine.createSpy('withSendingTime').andReturn(sha1HmacBuilderSpy);
		sha1HmacBuilderSpy.withRequestUrl = jasmine.createSpy('withRequestUrl').andReturn(sha1HmacBuilderSpy);
		
		it('Should set the authorization HTTP header', function(){
			//Given
			var message = JSON.stringify({name:'message',id:1});
			var now = new Date();
			var hmacKeyId = '137288';
			var sha1Hmac = 'Test';
			sha1HmacBuilderSpy.build = jasmine.createSpy('build').andReturn(sha1Hmac);
			var requestBuilder = new RequestBuilder(sha1HmacBuilderSpy)
				.withHmacKeyId(hmacKeyId)
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
			expect(request.headers.authorization).toBe('GGE4_API '+hmacKeyId+':'+sha1Hmac);
		});
		
		it('Should set the x-gge4-date HTTP header', function(){
			//Given
			var message = JSON.stringify({name:'message',id:1});
			var now = new Date();
			var hmacKeyId = '137288';
			var sha1Hmac = 'Test';
			sha1HmacBuilderSpy.build = jasmine.createSpy('build').andReturn(sha1Hmac);
			var requestBuilder = new RequestBuilder(sha1HmacBuilderSpy)
				.withHmacKeyId(hmacKeyId)
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
		
		it('Should set the x-gge4-content-sha1 HTTP header', function(){
			//Given
			var message = JSON.stringify({name:'message',id:1});
			var now = new Date();
			var hmacKeyId = '137288';
			var sha1Hmac = 'Test';
			sha1HmacBuilderSpy.build = jasmine.createSpy('build').andReturn(sha1Hmac);
			var requestBuilder = new RequestBuilder(sha1HmacBuilderSpy)
				.withHmacKeyId(hmacKeyId)
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
			expect(request.headers['x-gge4-content-sha1']).toBe("5f28be1f83589817406c6e4de9809fb7b67ffe91");
		});
		
		it('Should set the Content-Type HTTP header', function(){
			//Given
			var message = JSON.stringify({name:'message',id:1});
			var now = new Date();
			var hmacKeyId = '137288';
			var sha1Hmac = 'Test';
			sha1HmacBuilderSpy.build = jasmine.createSpy('build').andReturn(sha1Hmac);
			var requestBuilder = new RequestBuilder(sha1HmacBuilderSpy)
				.withHmacKeyId(hmacKeyId)
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
			expect(request.headers['Content-Type']).toBe("application/json");
		});
		
		it('Should set the Accept HTTP header', function(){
			//Given
			var message = JSON.stringify({name:'message',id:1});
			var now = new Date();
			var hmacKeyId = '137288';
			var sha1Hmac = 'Test';
			sha1HmacBuilderSpy.build = jasmine.createSpy('build').andReturn(sha1Hmac);
			var requestBuilder = new RequestBuilder(sha1HmacBuilderSpy)
				.withHmacKeyId(hmacKeyId)
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
			expect(request.headers.Accept).toBe("application/json");
		});
		
		it('Should set the host', function(){
			//Given
			var message = JSON.stringify({name:'message',id:1});
			var now = new Date();
			var hmacKeyId = '137288';
			var sha1Hmac = 'Test';
			sha1HmacBuilderSpy.build = jasmine.createSpy('build').andReturn(sha1Hmac);
			var requestBuilder = new RequestBuilder(sha1HmacBuilderSpy)
				.withHmacKeyId(hmacKeyId)
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
			expect(request.host).toBe("api.demo.globalgatewaye4.firstdata.com");
		});
		
		it('Should set the port', function(){
			//Given
			var message = JSON.stringify({name:'message',id:1});
			var now = new Date();
			var hmacKeyId = '137288';
			var sha1Hmac = 'Test';
			sha1HmacBuilderSpy.build = jasmine.createSpy('build').andReturn(sha1Hmac);
			var requestBuilder = new RequestBuilder(sha1HmacBuilderSpy)
				.withHmacKeyId(hmacKeyId)
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
			expect(request.port).toBe(443);
		});
		
		
		it('Should set the URI', function(){
			//Given
			var message = JSON.stringify({name:'message',id:1});
			var now = new Date();
			var hmacKeyId = '137288';
			var sha1Hmac = 'Test';
			sha1HmacBuilderSpy.build = jasmine.createSpy('build').andReturn(sha1Hmac);
			var requestBuilder = new RequestBuilder(sha1HmacBuilderSpy)
				.withHmacKeyId(hmacKeyId)
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
			expect(request.path).toBe('/transaction/v13');
		});
		
		it('Should set the method', function(){
			//Given
			var message = JSON.stringify({name:'message',id:1});
			var now = new Date();
			var hmacKeyId = '137288';
			var sha1Hmac = 'Test';
			sha1HmacBuilderSpy.build = jasmine.createSpy('build').andReturn(sha1Hmac);
			var requestBuilder = new RequestBuilder(sha1HmacBuilderSpy)
				.withHmacKeyId(hmacKeyId)
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
			expect(request.method).toBe('POST');
		});
		
	});
	
}());