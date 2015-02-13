# gateway-client

Gateway client to interface with gatewayd API's. See below for current use cases.

## Installation

````
npm install --save gateway-client
````

## Dependencies
- Git
- Node.js

## Usage

All API calls return a Promise which follows this format:
````
gatewayClient.someFunction()
  .then(function(response) {})
  .error(function(error) {})


var gatewayClient = new GatewayClient({
  url      : 'GATEWAY_URL',
  username : 'GATEWAY_USERNAME',
  password : 'GATEWAY_PASSWORD'
})

// getAllTransactions: get all external_transactions with status "queued",
// in order of time (earlier transactions are at the top) (GET)

gatewayClient.getAllTransactions()

// getNextTransaction: get the next transaction item that's queued (GET)

gatewayClient.getNextTransaction()

// createExternalTransaction: create an external_transaction to write into gatewayd database (POST)
// Parameter: transaction

gatewayClient.createExternalTransaction({
  deposit                : false,                                 
  external_account_id    : 12,                                    
  source_amount          : 2,                                     
  source_currency        : 'EUR',                                
  destination_amount     : 2,                                     
  destination_currency   : 'EUR',                                
  status                 : 'queued',                             
  ripple_transaction_id  : 234,                                   
  destination_account_id : 3,                                     
  uid                    : '2976e700-ae5c-11e4-ab27-0800200c9a66',
  user_id                : 1,                                     
  invoice_id             : '84cfb783192e9e563bf8e3b0ac31d9403a185e5af5f5a441db855dcc4a8a171a'
})

// updateTransactionStatus: update a transaction status of a transaction in gatewayd database (PUT)
// Parameters: transactionId (integer), status (string) - "cleared", "queued", "invoiced"

gatewayClient.updateTransactionStatus(transactionId, status)

// createExternalAccount: create an external account in gatewayd database (POST)
// Parameter: externalAccount

gatewayClient.createExternalAccount({
  address: 'DE72961562123476898541',
  name: 'Yong-Soo',
  user_id: 1,
  uid: '111',
  type: 'iban',
  data: 'Bank of Yong-Soo'
})
````