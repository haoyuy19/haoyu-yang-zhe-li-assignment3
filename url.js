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

router.get('/:short', async function (req, res) {
  console.log(req.params);
  var urlShort = req.params.short;
  urlShort = await urlModel.findOne({ short: urlShort });
  console.log(urlShort);
  if (urlShort == null) {
    return res.sendStatus(404);
  } else {
    return res.status(200).send(urlShort);
  }
});

function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if (!regex.test(str)) {
    return false;
  } else {
    return true;
  }
}

router.post('/', async function (req, res) {
  const urlData = req.body;
  var urlShort = urlData.short;
  var urlFull = urlData.full;
  var short = null;
  //console.log(isURL(urlFull));
  if (!ValidURL(urlFull)) {
    return res.status(415).send('Invalid full url');
  }
  urlFull = await urlModel.findOne({ full: urlFull });
  if (urlShort != null) {
    short = await urlModel.findOne({ short: urlShort });
  }
  if (short != null) {
    return res.status(409).send('Short url Already exist');
  } else if (urlFull != null) {
    return res.status(409).send('Full url Already exist');
  } else {
    insertUrl(urlData);
    return res.status(200).send('added successfully');
  }
});

router.delete('/:full/edit', async function (req, res) {
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

router.put('/:short/edit', async function (req, res) {
  const body = req.body;
  const short = body.short;
  var urlShort = body.short;
  var urlFull = body.full;
  console.log(urlFull);
  urlFull = await urlModel.findOne({ full: urlFull });

  if (urlFull != null) {
    console.log('LLLLLL');
    return res.status(200).send('Full url already exist');
  }
  urlShort = await urlModel.findOne({ short: urlShort });
  if (urlShort == null) {
    return res.status(200).send('Short url does not exist');
  } else {
    //await urlModel.updateOne({urlModel.short:urlShort});
    urlModel.findOneAndDelete({ short: short }, function (err, docs) {
      if (err) {
        console.log(err);
      }
    });
    insertUrl(body);
    return res.status(200).send('update successfully');
  }
});

module.exports = router;
