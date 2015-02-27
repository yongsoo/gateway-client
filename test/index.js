
var GatewayClient = require(__dirname+'/../src/index')
var assert = require('assert')
var uuid = require('uuid') 

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe('Gateway Client', function() {
  var gatewayClient;

  beforeEach(function() {
    gatewayClient = new GatewayClient({
      url: process.env['EUR_GATEWAY_URL'],
      username: process.env['EUR_GATEWAY_USERNAME'],
      password: process.env['EUR_GATEWAY_PASSWORD']
    })
  });

  it.skip('should be able to get external payments', function(done) {
    gatewayClient.getAllTransactions()
      .then(function(payments) {
        assert.strictEqual(typeof payments, 'object');
        done();
      })
  });

  it.skip('should be able to update transaction status to cleared', function(done) {
    var uuidNum = uuid.v4();
    var transaction = {
      deposit: false,
      external_account_id: 12,
      source_amount: 0.01,
      source_currency: 'EUR',
      destination_amount: 0.01,
      destination_currency: 'EUR',
      status: 'queued',
      ripple_transaction_id: 234,
      destination_account_id: 23,
      uid: uuid.v4()
    };

    gatewayClient.createExternalTransaction(transaction)
      .then(function(transactions) {
        gatewayClient.updateTransactionStatus(transactions.externalTransaction.id, 'cleared')
          .then(function(response) {
            assert.strictEqual(response.externalTransaction.status, 'cleared');
            done();
          })
      })
  });

  it('should not be able to create an external account with invalid address field', function(done) {
    var externalAcct = {
      address: 3,
      name: 'GATEWAY_ACCOUNT',
      type: 'gateway' 
    }

    gatewayClient.createExternalAccount(externalAcct)
      .error(function(error) {
        console.log('error', error);
        assert.strictEqual(error instanceof Error, true);
        assert.strictEqual(error.message, 'Address must be a string');
        done();
      })
  });

  it('should not be able to create an external account with invalid name field', function(done) {
    var externalAcct = {
      address: 'gateway',
      name: 94851,
      type: 'gateway' 
    }

    console.log('external act', externalAcct);

    gatewayClient.createExternalAccount(externalAcct)
      .error(function(error) {
        console.log('error', error);
        assert.strictEqual(error instanceof Error, true);
        assert.strictEqual(error.message, 'Name must be a string');
        done();
      })
  });

  it('should not be able to create an external account with invalid type field', function(done) {
    var externalAcct = {
      address: 'gateway',
      name: 'GATEWAY_ACCOUNT',
      type: 54252 
    }

    gatewayClient.createExternalAccount(externalAcct)
      .error(function(error) {
        console.log('error', error);
        assert.strictEqual(error instanceof Error, true);
        assert.strictEqual(error.message, 'Type must be a string');
        done();
      })
  });

  it.skip('should be able to create a transaction', function(done) {
    var uuidNum = uuid.v4();
    var transaction = {
      deposit: false,
      external_account_id: 12,
      source_amount: 0.01,
      source_currency: 'EUR',
      destination_amount: 0.01,
      destination_currency: 'EUR',
      status: 'queued',
      ripple_transaction_id: 234,
      destination_account_id: 34,
      uid: uuid.v4()
    };

    gatewayClient.createExternalTransaction(transaction)
      .then(function(response) {
        assert.strictEqual(response.success, true);
        done();
      })
  });

  it.skip('should be able to create an external account', function(done) {

    // In order for this test to pass, you must give a unique address, user_id, and uid
    var externalAcct = {
      address: 'gateway',
      name: 'GATEWAY_ACCOUNT',
      type: 'gateway' 
    }

    gatewayClient.createExternalAccount(externalAcct)
      .then(function(response) {
        assert.strictEqual(response.success, true);
        done();
      })
  });


});