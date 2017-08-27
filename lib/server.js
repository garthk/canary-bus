const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const auto = require('./').auto;
const schema = require('./schema');
const path = require('path');
const fs = require('fs');
const joi = require('joi');
const exphbs = require('express-handlebars'); 
const marky = require('marky-markdown');

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

/** Make the express app given a CanaryBus and a secret path */
function makeapp(bus, secret, obvious) {
  const app = express();
  let README;
  
  if (obvious) {
    const raw = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
    README = marky(raw);
    app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');
  }
  
  app.use(express.static(path.join(__dirname, '..', 'public'), { index: false }));
  app.use(log);

  app.get('/', function (request, response) {
    if (obvious) {
      response.render('readme', { readme: README });
    } else {
      response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }
  });

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