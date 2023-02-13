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

// Read the dev or prod URLs to be used
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// Setup app and view
const app = setupView(express(), 'home');

// Setup root route
app.get('/', (req, res) => {
  const { DEMO_HOME_URL, PUBLISHER_A_URL, PUBLISHER_B_URL, CONTENT_PRODUCER_URL, PAYMENT_PROVIDER_URL } = process.env;

  res.render('index', {
    demoHomeUrl: DEMO_HOME_URL,
    publisherAUrl: PUBLISHER_A_URL,
    publisherBUrl: PUBLISHER_B_URL,
    contentProducerUrl: CONTENT_PRODUCER_URL,
    paymentProviderUrl: PAYMENT_PROVIDER_URL,
  });
});

exports.home = functions.https.onRequest(app);
