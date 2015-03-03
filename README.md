gge4-node
=========

Node JS Client for Bank of America's First Data Global Gateway e4 credit card processing service.

## Installation

  npm install gge4 --save

## Usage

```javascript
var GGe4Proxy = require('GGe4Proxy');

var gge4Configuration = {
		hmacKey: '',
		hmacKeyId: '',
		serviceUri: '/transaction/v14',
		serviceEndPoint: 'api.demo.globalgatewaye4.firstdata.com',
		gatewayId: '',
		password: ''
	};
	
var gge4Proxy = new GGe4Proxy(gge4Configuration);

var charge = {
		amount:50.00, 
		creditCard: { 
			name: 'John Doe, 
			number: '4111111111111111', 
			expirationMonth: '01', 
			expirationYear: '20'
		}
	};
	
gge4Proxy.purchase(charge)
.then(function (payment) {
	//do something with the payment reciept
})
.fail(function (err) {
	//do something with the payment failure
});
```

## Tests

  npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit and integration tests for any new or changed functionality. Lint and test your code.

## Release History

* 1.0.0 Initial release


### Additional Information

First Data Global Gateway:

First Data Global Gateway e4℠ Knowledge Base (Manage Demo Account)
The Global Gateway e4 Help Desk is available 24/7 at 855-448-3493
Hours of Operation
8-10PM M-F
9-?-Sat

- ##### URI: https://globalgatewaye4.firstdata.com/
- ##### WEB SERVIE API: https://firstdata.zendesk.com/entries/407571-First-Data-Global-Gateway-e4-Web-Service-API-Reference-Guide
- ##### Test Credit Card Numbers: https://firstdata.zendesk.com/entries/407651-Using-test-credit-card-numbers
- ##### Highest Transactions Allowed: https://firstdata.zendesk.com/entries/20730816-what-is-the-highest-transaction-amount-allowed-within-gge4
- #### Require CVV: https://firstdata.zendesk.com/entries/407683-Making-CVD-CVV2-field-appear-in-my-First-Data-Global-Gateway-e4-Payment-Page
- #### Text CVV: https://firstdata.zendesk.com/entries/407655-How-to-test-CVD-CVV-CVV2-functionality


ONLY FIREFOX AND IE BROWSERS ARE SUPPORTED!!!!

```javascript
/*
 * The key used for the HMAC calculation can be 
 * obtained through the Realtime Payment Manager 
 * interface when using a Merchant Administrator 
 * account.
 * Login: https://demo.globalgatewaye4.firstdata.com/?lang=en
 * username: logic54
 * password: jWwR3JW8ANUdpdp
 */
 ```
