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
const express = require('express');
const functions = require('firebase-functions');
const setupView = require('../helpers/setup-view');
const setupPrivateAggregationTestRoutes = require('./setup-paa-test-routes');

// Read the dev or prod URLs to be used
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// Setup app and view
const app = setupView(express(), 'content-producer');

// Setup Private Aggregation API test routes
setupPrivateAggregationTestRoutes(app);

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

exports.contentProducer = functions.https.onRequest(app);
