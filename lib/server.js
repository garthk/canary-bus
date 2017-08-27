const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const auto = require('./').auto;
const schema = require('./schema');
const path = require('path');
const fs = require('fs');
const joi = require('joi');

/** Run an express server with a web hook at /SECRET */
function main() {
  dotenv.config();
  const secret = process.env.SECRET;
  const bus = auto();
  const obvious = joi.attempt(process.env.TMI, joi.boolean().empty('').default(false).label('TMI'));
  const app = makeapp(bus, secret, obvious);
  const listener = app.listen(process.env.PORT, () => {
    console.log('# Listening on port ' + listener.address().port);
  });
}

/** A truly awful renderer, but it keeps `node_modules` lean */
function render(text, subs) {
  for (let key in subs) {
    text = text.replace(`{{${key}}}`, subs[key]);
  }
  return text;
}

/** Make the express app given a CanaryBus and a secret path */
function makeapp(bus, secret, obvious) {
  const app = express();
  let README;

  if (obvious) {
    app.get('/', (req, res) => {
      const { name, version, description } = require('../package.json');
      const markdown = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
      let html = fs.readFileSync(path.join(__dirname, '..', 'views', 'readme.html'), 'utf8');
      res.send(render(html, { name, version, description, markdown }));
    });
  } else {
    app.use(express.static(path.join(__dirname, '..', 'public'), { index: false }));
  }

  app.use(log);

  app.get('/' + secret, function (request, response) {
    response.sendStatus(200);
  });

  app.post('/' + secret, bodyParser.json(), function (request, response, next) {
    bus.report(request.body).then(() => response.sendStatus(200), next);
  });

  app.use(fail);

  return app;
}

/** Log very, very simply to standard output */
function log(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next()
}

/** Report errors very, very simply to standard error */
function fail(err, req, res, next) {
  console.error(err.stack);
  res.sendStatus(500);
  next(null);
}

module.exports = {
  makeapp,
  main
};
