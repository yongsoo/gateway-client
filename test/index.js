
var GatewayClient = require(__dirname+'/../src/index')
var assert = require('assert')
var uuid = require('uuid') 

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe('Gateway Client', function() {
  var gatewayClient;

  beforeEach(function() {
    gatewayClient = new GatewayClient({
      url: process.env['USD_GATEWAY_URL'],
      username: process.env['USD_GATEWAY_USERNAME'],
      password: process.env['USD_GATEWAY_PASSWORD']
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

    gatewayClient.createExternalAccount(externalAcct)
      .error(function(error) {
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
        assert.strictEqual(error instanceof Error, true);
        assert.strictEqual(error.message, 'Type must be a string');
        done();
      })
  });

  it('should not be able to create an external transaction with invalid source_amount field', function(done) {
    var transaction = {
      deposit: false,
      external_account_id: 12,
      source_amount: 'invalid',
      source_currency: 'EUR',
      destination_amount: 0.01,
      destination_currency: 'EUR',
      status: 'queued',
      ripple_transaction_id: 234,
      destination_account_id: 34,
      uid: uuid.v4()
    };

    gatewayClient.createExternalTransaction(transaction)
      .error(function(error) {
        assert.strictEqual(error instanceof Error, true);
        assert.strictEqual(error.message, 'source_amount must be a number');
        done();
      })
  });

  it('should not be able to create an external transaction with invalid destination_amount field', function(done) {
    var transaction = {
      deposit: false,
      external_account_id: 12,
      source_amount: 0.01,
      source_currency: 'EUR',
      destination_amount: 'invalid',
      destination_currency: 'EUR',
      status: 'queued',
      ripple_transaction_id: 234,
      destination_account_id: 34,
      uid: uuid.v4()
    };

    gatewayClient.createExternalTransaction(transaction)
      .error(function(error) {
        assert.strictEqual(error instanceof Error, true);
        assert.strictEqual(error.message, 'destination_amount must be a number');
        done();
      })
  });

  it('should not be able to create an external transaction with invalid source_currency field', function(done) {
    var transaction = {
      deposit: false,
      external_account_id: 12,
      source_amount: 0.01,
      source_currency: 3333,
      destination_amount: 0.01,
      destination_currency: 'EUR',
      status: 'queued',
      ripple_transaction_id: 234,
      destination_account_id: 34,
      uid: uuid.v4()
    };

    gatewayClient.createExternalTransaction(transaction)
      .error(function(error) {
        assert.strictEqual(error instanceof Error, true);
        assert.strictEqual(error.message, 'source_currency must be a string');
        done();
      })
  });

  it('should not be able to create an external transaction with invalid destination_currency field', function(done) {
    var transaction = {
      deposit: false,
      external_account_id: 12,
      source_amount: 0.01,
      source_currency: 'EUR',
      destination_amount: 0.01,
      destination_currency: 3333,
      status: 'queued',
      ripple_transaction_id: 234,
      destination_account_id: 34,
      uid: uuid.v4()
    };

    gatewayClient.createExternalTransaction(transaction)
      .error(function(error) {
        assert.strictEqual(error instanceof Error, true);
        assert.strictEqual(error.message, 'destination_currency must be a string');
        done();
      })
  });

  it('should not be able to create an external transaction with invalid destination_account_id field', function(done) {
    var transaction = {
      deposit: false,
      external_account_id: 12,
      source_amount: 0.01,
      source_currency: 'EUR',
      destination_amount: 0.01,
      destination_currency: 'EUR',
      status: 'queued',
      ripple_transaction_id: 234,
      destination_account_id: 'invalid',
      uid: uuid.v4()
    };

    gatewayClient.createExternalTransaction(transaction)
      .error(function(error) {
        assert.strictEqual(error instanceof Error, true);
        assert.strictEqual(error.message, 'destination_account_id must be a number');
        done();
      })
  });

  it.skip('should be able to create a transaction', function(done) {
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
      address: 'DUMMY_USD_FOR_QUOTING_ONLY',
      name: 'For Quoting',
      type: 'acct' 
    }

    gatewayClient.createExternalAccount(externalAcct)
      .then(function(response) {
        assert.strictEqual(response.success, true);
        done();
      })
  });


});