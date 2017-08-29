// import { create } from 'silhouette-core'
// import rxjsPlugin from 'silhouette-plugin-rxjs'
import { create } from 'silhouette'
// import reduxPlugin from 'silhouette-plugin-redux'
// import logger from 'redux-logger'
// import { composeWithDevTools } from 'redux-devtools-extension'

let sil = create();

console.log(sil);

sil.define({ view: {}, data: {}, auth: {} });

export let view = sil.view;
export let data = sil.data;
export let auth = sil.auth;


