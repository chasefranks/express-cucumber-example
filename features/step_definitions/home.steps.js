const assert = require('assert');
const { Given, When, Then } = require('cucumber');

const request = require('superagent');

const baseUri = 'http://localhost:3000';

When('I visit the home route', function () {

  console.log('visiting home route', baseUri);

  /**
   * when the step definition returns a promise
   * Cucumber will interpret the step as 'done'
   * when the promise resolves or rejects
   */
  return request.get(baseUri)
    .then(res => {
      console.log('debug >>>', 'status: ', res.status);
      console.log('debug >>>', 'body: ', res.body);
      this.status = res.status;
      this.body = res.body;
    }).catch(err => {
        console.log('error visiting home route');
        console.log('error', err);
        throw new Error('some error happened!');
    });

});

Then('the response is an HTTP success', function () {
  console.log('checking the http status code');
  assert.equal(this.status, 200);
});

Then('the message encourages testing', function () {
  console.log('inspecting json response');
  assert.equal(this.body.message, 'test me');
});
