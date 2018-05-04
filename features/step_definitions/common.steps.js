const assert = require('assert');
const { Then } = require('cucumber');

const httpCodes = {
  'ok': 200,
  'created': 201,
  'bad request': 400,
  'authorization required': 401,
  'unauthorized': 403,
  'not found': 404,
  'server error': 500
};

Then(/^I get an HTTP (.*)$/, function(responseType) {

  var code = httpCodes[responseType.toLowerCase()];

  if (!code) {
    throw new Error(`${responseType} not recognized as an http error`);
  }

  assert.equal(this.status, code);
})
