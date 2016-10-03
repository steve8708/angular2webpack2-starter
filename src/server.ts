// the polyfills must be the first thing imported in node.js
import './polyfills.server';
import './rxjs.imports';

// polyfills
import 'es6-promise';
import 'es6-shim';
import 'reflect-metadata';
import 'zone.js/dist/zone-node.js';
import 'zone.js/dist/long-stack-trace-zone';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';

// App
// import { AppModule } from './app/app.module.universal.node';
import { AppModuleNgFactory } from './compiled/src/app/app.module.universal.node.ngfactory';
import { routes } from './server.routes';
import { HOST, UNIVERSAL_PORT } from '../constants';

// enable prod for faster renders
enableProdMode();

const useAot = true;

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

// Express View
app.engine('.html', createEngine({
  precompile: !useAot,
}));
app.set('views', __dirname);
app.set('view engine', 'html');
app.use(compression());
app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());

// Serve static files

app.use('/assets', express.static(path.join(__dirname, 'assets'), {maxAge: 30}));

function ngApp(req, res) {
  res.render('index', {
    req,
    res,
    ngModule: AppModuleNgFactory,
    preboot: {
      appRoot: ['my-app'],
    },
    baseUrl: '/',
    requestUrl: req.originalUrl,
    originUrl: req.hostname
  });
}

app.get('/', ngApp);
routes.forEach(route => {
  app.get(`/${route}`, ngApp);
  app.get(`/${route}/*`, ngApp);
});

app.use(express.static(path.join(ROOT, 'dist/client'), {index: false}));
app.get('*', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const pojo = { status: 404, message: 'No Content' };
  const json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
let server = app.listen(process.env.PORT || UNIVERSAL_PORT, () => {
  console.log(`Listening on: http://${HOST}:${server.address().port}`);
});
