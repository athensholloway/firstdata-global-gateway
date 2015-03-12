(function () {
   'use strict';

	describe('GGe4Proxy', function() {
		var GGe4Proxy = require('../../src/GGe4Proxy');
		
		function buildCharge () {
			return {
				amount:100.00, 
				creditCard: { //Visa
					name:'Test Customer', 
					number:'4111111111111111', 
					expirationMonth:'06', 
					expirationYear:'25',
					securityCode: '123'
				}
			};
		}
		
		function buildGGe4Config () {
			return {
				hmacKey: '',
				hmacKeyId: '',
				serviceUri: '/transaction/v14',
				serviceEndPoint: 'api.demo.globalgatewaye4.firstdata.com',
				gatewayId: '',
				password: ''
			};
		}
				
		it('Should charge a credit card', function(done){
			
			//Given
			var charge = buildCharge();
			var gge4Config = buildGGe4Config();
			var gge4Proxy = new GGe4Proxy(gge4Config);
			
			//When
			var promise = gge4Proxy.purchase(charge);
			
			//Then
			promise.then(
				function successfulPurchaseCallback(response){
					expect(response.authorizationNumber).toBeDefined();
					expect(response.clientIP).toBeDefined();
					expect(response.sequenceNumber).toBeDefined();
					expect(response.transactionTag).toBeDefined();
					expect(response.customerTransactionRecord).toBeDefined();
					expect(response.amount).toBeDefined();
					expect(response.creditCardNumber).toBeDefined();
					expect(response.creditCardType).toBeDefined();
					expect(response.creditCardExpirationDate).toBeDefined();
					expect(response.cardholderName).toBeDefined();
					expect(response.currencyCode).toBeDefined();
					expect(response.rawData).toBeDefined();
					done();
				},
				function failedPurchaseCallback(response){
					console.log(response);
					expect(true).toBe(false);
					done();
				});
			
		}, 5000);
		
		it('Should decline an expired card number', function(done){
			
			//Given
			var charge = buildCharge();
			var gge4Config = buildGGe4Config();
			var gge4Proxy = new GGe4Proxy(gge4Config);
			charge.creditCard.expirationYear='00';
			//When
			var promise = gge4Proxy.purchase(charge);
			
			//Then
			promise.then(
				function successfulPurchaseCallback(response){
					expect(true).toBe(false);
					done();
				},
				function failedPurchaseCallback(response){
					var reason = 'Your credit card has an expired an or bad date sent. Confirm the correct date.';
					
					expect(response.reason).toBe(reason);
					done();
				});
			
		}, 5000);
		
		it('Should require a security code', function(done){
			
			//Given
			var charge = buildCharge();
			var gge4Config = buildGGe4Config();
			var gge4Proxy = new GGe4Proxy(gge4Config);
			
			charge.creditCard.securityCode = undefined;
			
			//When
			var promise = gge4Proxy.purchase(charge);
			
			//Then
			promise.then(
				function successfulPurchaseCallback(response){
					expect(true).toBe(false);
					done();
				},
				function failedPurchaseCallback(response){
					var reason = 'Your credit card security code is invalid or missing.';
					expect(response.reason).toBe(reason);
					done();
				});
			
		}, 5000);
		
	});
	
}());