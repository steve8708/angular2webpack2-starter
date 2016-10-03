import './polyfills.browser.aot';
import './rxjs.imports';
declare var ENV: string;

import { enableProdMode } from '@angular/core';
import { platformUniversalDynamic } from 'angular2-universal/browser';
// TODO: separate file for this
import { AppModuleNgFactory } from './compiled/src/app/app.module.universal.browser.ngfactory';

if ('production' === ENV) {
  enableProdMode();
}

console.log('correct file!');

export function main() {
  return platformUniversalDynamic().bootstrapModuleFactory(AppModuleNgFactory as any)
    .catch(err => console.log(err));
}

export function bootstrapDomReady() {
  document.addEventListener('DOMContentLoaded', main);
}

bootstrapDomReady();
