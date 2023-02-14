/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs = require('fs');
// const cors = require('cors');
const express = require('express');
const functions = require('firebase-functions');
const setupView = require('../helpers/setup-view');

// Read the dev or prod URLs to be used
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// Setup app and view
const app = setupView(express(), 'content-producer');
// app.use(cors());

// Setup root route
app.get('/', (req, res) => {
  const { DEMO_HOME_URL, PUBLISHER_A_URL, PUBLISHER_B_URL, CONTENT_PRODUCER_URL, PAYMENT_PROVIDER_URL } = process.env;

  res.render('index', {
    demoHomeUrl: DEMO_HOME_URL,
    publisherAUrl: PUBLISHER_A_URL,
    publisherBUrl: PUBLISHER_B_URL,
    contentProducerUrl: CONTENT_PRODUCER_URL,
    paymentProvider: PAYMENT_PROVIDER_URL,
  });
});

app.get('/payment-provider', (req, res) => {
  const { DEMO_HOME_URL, PUBLISHER_A_URL, PUBLISHER_B_URL, CONTENT_PRODUCER_URL, PAYMENT_PROVIDER_URL } = process.env;

  res.render('payment-provider', {
    demoHomeUrl: DEMO_HOME_URL,
    publisherAUrl: PUBLISHER_A_URL,
    publisherBUrl: PUBLISHER_B_URL,
    contentProducerUrl: CONTENT_PRODUCER_URL,
    paymentProvider: PAYMENT_PROVIDER_URL,
  });
});

app.get('/demographics-survey', (req, res) => {
  const { DEMO_HOME_URL, PUBLISHER_A_URL, PUBLISHER_B_URL, CONTENT_PRODUCER_URL, PAYMENT_PROVIDER_URL } = process.env;

  res.render('demographics-survey', {
    demoHomeUrl: DEMO_HOME_URL,
    publisherAUrl: PUBLISHER_A_URL,
    publisherBUrl: PUBLISHER_B_URL,
    contentProducerUrl: CONTENT_PRODUCER_URL,
    paymentProvider: PAYMENT_PROVIDER_URL,
  });
});

app.post('/report/hover', (req, res) => {
  console.log('\x1b[1;31m%s\x1b[0m', `🚀 You have received an event-level report from the browser`);
  console.log('QUERY PARAMS RECEIVED (event-level):\n=== \n', req.query, '\n=== \n');
  console.log('PAYLOAD RECEIVED (event-level):\n=== \n', req.body, '\n=== \n');
  res.sendStatus(200);
});

app.post('/.well-known/private-aggregation/report-shared-storage', (req, res) => {
  console.log('\x1b[1;31m%s\x1b[0m', `🚀 You have received an event-level report from the browser`);
  console.log('REGULAR REPORT RECEIVED (event-level):\n=== \n', req.body, '\n=== \n');
  res.sendStatus(200);
});

function replaceMacro(data, siteId, debugKey) {
  data = data.replace('%%SITE_ID%%', siteId);
  return data.replace('%%DEBUG_KEY%%', debugKey);
}

app.get('/paa/scripts/private-aggregation-test.js', async (req, res) => {
  const { siteId, debugKey } = req.query;

  let response;

  try {
    const data = await fs.promises.readFile(`${__dirname}/paa/scripts/private-aggregation-test.js`, 'utf8');
    response = replaceMacro(data, siteId, debugKey);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error reading file');
  }

  res.send(response);
});

app.get('/paa/scripts/private-aggregation-test.html', async (req, res) => {
  const { siteId, debugKey } = req.query;

  let response;

  try {
    const data = await fs.promises.readFile(`${__dirname}/paa/scripts/private-aggregation-test.html`, 'utf8');
    response = replaceMacro(data, siteId, debugKey);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error reading file');
  }

  res.send(response);
});

app.get('/paa/scripts/private-aggregation-test-runner.js', async (req, res) => {
  const { siteId, debugKey } = req.query;

  let response;

  try {
    const data = await fs.promises.readFile(`${__dirname}/paa/scripts/private-aggregation-test-runner.js`, 'utf8');
    response = replaceMacro(data, siteId, debugKey);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error reading file');
  }

  res.send(response);
});

app.get('/paa/scripts/private-aggregation-test-worklet.js', async (req, res) => {
  console.log('!!!!!!!!!!!!!!!!')
  const response = await fs.promises.readFile(`${__dirname}/paa/scripts/private-aggregation-test-worklet.js`, 'utf8');
  // res.set({
  //   'Content-Type': 'text/js',
  // });
  res.type('.js');
  res.send(response);
});

app.get('/experiment/reports', (req, res) => {
  const debugKey = req.query.debugKey;

  // Return the reports collected for that site id
});

exports.contentProducer = functions.https.onRequest(app);
