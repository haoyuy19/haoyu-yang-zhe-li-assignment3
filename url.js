const { response, Router } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const urlSchema = require('./config/url.schema').urlSchema;
const urlModel = mongoose.model('url', urlSchema);
const { getAllUrl, insertUrl } = require('./config/url.model');

router.get('/', function (req, res) {
  //console.log(response);
  return getAllUrl().then(
    function (response) {
      res.status(200).send(response);
    },
    function (error) {
      res.status(404).send('Error');
    }
  );
});

router.get('/:full', async function (req, res) {
  console.log(req.params);
  const urlFull = req.params.full;
  const full = await urlModel.findOne({ full: urlFull });
  console.log(full);
  if (full == null) {
    return res.sendStatus(404);
  } else {
    return res.status(200).send(full);
  }
});

router.post('/', async function (req, res) {
  const urlData = req.body;

  const urlFull = urlData.full;
  const full = await urlModel.findOne({ full: urlFull });
  console.log(full);
  if (full !== null) {
    return res.status(200).send('Already exist');
  } else {
    insertUrl(urlData);
    return res.status(200).send('added successfully');
  }
});

router.delete('/:full', async function (req, res) {
  const urlFull = req.params.full;
  var flag = false;
  var full = await urlModel.findOne({ full: urlFull });
  if (full === null) {
    flag = true;
    full = await urlModel.findOne({ short: urlFull });
  }
  if (full === null) {
    return res.status(200).send('Record not found');
  } else {
    if (!flag) {
      urlModel.findOneAndDelete({ full: urlFull }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).send('deleted successfully');
        }
      });
    } else {
      urlModel.findOneAndDelete({ short: urlFull }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).send('deleted successfully');
        }
      });
    }
  }
});

module.exports = router;
