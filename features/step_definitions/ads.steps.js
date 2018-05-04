const assert = require('assert');
const expect = require('chai').expect;
const _ = require('lodash');
const { Given, When, Then } = require('cucumber');

const request = require('superagent');

const baseUri = 'http://localhost:3000';

const handleSuccess = ( res, world ) => {
  console.log('successful response received');
  world.status = res.status;
  world.body = res.body;
  world.header = res.header

  // should try to unwrap as much of this as possible to make it more convenient
  world._rawResponse = res;
}

const handleFailure = (res, world ) => {
  console.log('superagent error');

  /*
   * what we want to do here is handle the error
   * but not the really bad errors like the server being down, just http errors
   * and if you're not convinced that these two cases are in the same boat, try it out
   * see http://visionmedia.github.io/superagent/#error-handling
   */
  if (err && err.status) {
    console.log('HTTP error: status', err.response.status);
    console.log('HTTP error: body', err.response.body);
    this.status = err.response.status;
    this.body = err.response.body;
    this._rawResponse = err.response;
  } else {
    // some other type of error like network error, timeout, etc.
    // throw so it fails the step
    throw err;
  }

}

Given('an ad I want to place', function () {
  this.ad = {
    item: 'mountain bike, barely used',
    price: 200,
    contact: {
      name: 'John Avery',
      email: 'javery@example.com',
      phone: '123-456-7890'
    }
  }
});

When('I create the ad', function () {
  var adsUri = `${baseUri}/ads`;
  console.log('creating new ad by POSTing to ', adsUri);

  return request.post(adsUri)
            .set('Content-Type', 'application/json')
            .send(this.ad)
            .then(res => handleSuccess(res, this))
            .catch(err => handleFailure(res, this));
});

Then('the location of the newly created add is returned', function () {
  assert(this.header.location);
});

Then('the newly created add can be found there', function () {

  var location = this.header.location;

  return request.get(location)
    .then(res => {

      var newAd = res.body;

      // assert that there is at least some id
      assert(res.body.id);

      assert.equal(this.ad.item, newAd.item);
      assert.equal(this.ad.price, newAd.price);
      assert.equal(this.ad.contact.name, newAd.contact.name);
      assert.equal(this.ad.contact.email, newAd.contact.email);
      assert.equal(this.ad.contact.phone, newAd.contact.phone);

    }).catch(err => {
      throw err;
    });

});

When(/^I try to create an add that is missing a required (.*)$/, function (requiredField) {

  var adsUri = `${baseUri}/ads`;

  var ad = {
    item: 'mountain bike, barely used',
    price: 200,
    contact: {
      name: 'John Avery',
      email: 'javery@example.com',
      phone: '123-456-7890'
    }
  }

  // remove requiredField
  ad = _.omit(ad, requiredField);
  console.log('trying to create ad', ad);

  return request.post(adsUri)
    .set('Content-Type', 'application/json')
    .send(ad)
    .then(res => handleSuccess(res, this))
    .catch(err => handleFailure(res, this));

});

Then(/^the response tells me what (.*) is missing$/, function (field) {
  expect(this.body.validation_error).to.include(field);
});

When('I try to create an ad that is missing both the contact\'s phone and email', function () {
  var ad = {
    item: 'mountain bike, barely used',
    price: 200,
    contact: {
      name: 'John Avery',
      email: 'javery@example.com',
      phone: '123-456-7890'
    }
  };

  ad = _.omit(ad, ['contact.email', 'contact.phone']);

  return request.post(`${baseUri}/ads`)
    .set('Content-Type', 'application/json')
    .send(ad)
    .then(res => handleSuccess(res, this))
    .catch(err => handleFailure(res, this));
    
});
