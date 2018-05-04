const assert = require('assert');
const { Given, When, Then } = require('cucumber');

When('I get a promise that fullfills', function() {
  return Promise.resolve(89);
});

Then('I make it to this step', function() {

});

When('I get a promise that is rejected', function() {
  return Promise.reject(89);
});

Then('I don\'t make it to this step', function() {
  // shouldn't make it here
});

When('I get a promise that fullfills with {string}', function (string) {
  return Promise.resolve(string)
});

Then('this scenario is marked pending the step', function () {
  // shouldn't make it here
});
