
var Promise = require('bluebird')
var http = require('superagent')

var GatewayClient = function(options) {
  this.url = options.url;
  this.username = options.username;
  this.password = options.password;
}

GatewayClient.prototype.getAllTransactions = function() {
  var _this = this;

  return new Promise(function(resolve, reject) {
    return http
      .get(_this.url + '/v1/external_transactions')
      .query({
        status: 'queued',
        sort_direction: 'desc'
      })
      .auth(_this.username, _this.password)
      .end(function(error, response) {
        if (error) {
          return reject(error);
        }
        resolve(response.body.external_transactions);
      });
  });
}

GatewayClient.prototype.getNextTransaction = function() {
  var _this = this;

  return _this.getAllTransactions()
    .then(function(transactions) {
      return Promise.resolve(transactions[0]);
    });
}

GatewayClient.prototype.createExternalTransaction = function(transaction) {
  var _this = this;

  return new Promise(function(resolve, reject) {
    if (typeof transaction.source_amount !== 'number') {
      return reject(new Error('source_amount must be a number'));
    }

    if (typeof transaction.destination_amount !== 'number') {
      return reject(new Error('destination_amount must be a number'));
    }

    if (typeof transaction.source_currency !== 'string') {
      return reject(new Error('source_currency must be a string'));
    }

    if (typeof transaction.destination_currency !== 'string') {
      return reject(new Error('destination_currency must be a string')); 
    }

    if (typeof transaction.destination_account_id !== 'number') {
      return reject(new Error('destination_account_id must be a number'));
    }

    http
      .post(_this.url + '/v1/external_transactions')
      .auth(_this.username, _this.password)
      .send(transaction)
      .end(function(error, response) {
        if (error) {
          return reject(error);
        }
        resolve(response.body);
      });
  });
}

GatewayClient.prototype.updateTransactionStatus = function(transactionId, status) {
  var _this = this;

  return new Promise(function(resolve, reject) {
    return http
      .put(_this.url + '/v1/external_transactions/' + transactionId)
      .send({ status: status })
      .auth(_this.username, _this.password)
      .end(function(error, response) {
        if (error) {
          return reject(error);
        }
        resolve(response.body);
      });
  });
}

GatewayClient.prototype.createExternalAccount = function(externalAccount) {
  var _this = this;

  return new Promise(function(resolve, reject) {
    if (typeof externalAccount.address !== 'string') {
      return reject(new Error('Address must be a string'));
    }

    if (typeof externalAccount.name !== 'string') {
      return reject(new Error('Name must be a string'));
    }

    if (typeof externalAccount.type !== 'string') {
      return reject(new Error('Type must be a string'));
    }

    http
      .post(_this.url + '/v1/external_accounts')
      .auth(_this.username, _this.password)
      .send(externalAccount)
      .end(function(error, response) {
        if (error) {
          return reject(error);
        }
        console.log('External Account created:', response.body);
        resolve(response.body);
      })
  })
}

module.exports = GatewayClient;