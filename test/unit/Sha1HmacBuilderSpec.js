(function () {
   'use strict';
		
	describe('SHA-1 HMAC Builder', function() {
		var Sha1HmacBuilder = require('../../src/Sha1HmacBuilder');
		
		
		it('Should build the SHA-1 HMAC digest', function(){
			
			//Given
			var hmacKey = '_Jcn8wvSqrqKlhCUdId2Xpl5hO6bINMG'; 
			var sha1HmacBuilder = new Sha1HmacBuilder(hmacKey)
				.withContentType('application/json')
				.withRequestMethod('POST')
				.withContentDigest('e8d591e4c15cc0dcba0c916299cbaf91da65c9d3')
				.withSendingTime('2014-05-24T14:00:30Z')
				.withRequestUrl('/transaction/v12');

			//When
			var digest = sha1HmacBuilder.build();
			
			//Then
			expect(digest).toBe('JfaDjH45G3dXB7yEW6zhAjvXvuE=');
			
		});
	});
	
}());