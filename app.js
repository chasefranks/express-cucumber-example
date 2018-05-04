const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');

const app = express();
app.use('/ads', bodyParser.json());

this.ads = {};

// add additional routes here
app.get('/', (req, res) => {
  res.status(200)
    .json({
      message: 'test me'
    });
})

app.post('/ads', (req, res) => {
  console.log(req.body);

  try {
    validate(req.body)
  } catch (e) {
    console.log(e);
    res.status(400)
      .json({
        validation_error: e.message
      });
    return;
  }

  var newAd = req.body;
  newAd.id = shortid.generate();

  save(newAd);

  res.status(201)
    .append('Location', `http://localhost:3000/ads/${newAd.id}`)
    .send();
});

app.get('/ads/:id', (req, res) => {

  var found = getById(req.params.id);

  if (found) {
    res.status(200)
      .json(found);
  } else {
    res.status(404);
  }

});

app.listen(3000, () => {
  console.log('API is up on port 3000');
})

const save = ( ad ) => {
  console.log('saving new ad', ad);
  this.ads[ad.id] = ad;
}

const getById = ( id ) => {
  return this.ads[id];
}

const validate = ( ad ) => {
  if (!ad.item || ad.item.length == 0) {
    throw new Error("missing item description");
  }

  if (ad.price < 0) {
    throw new Error("missing price");
  }

  if (!ad.contact || !ad.contact.name ) {
    throw new Error("missing contact.name");
  }

  if ( !ad.contact || (!ad.contact.email && !ad.contact.phone) ) {
    throw new Error("At least one of contact.email or contact.phone is required.");
  }

}
