/**
 * Copyright 2023 Google LLC
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

const PRIVATE_AGGREGATION_TEST_IFRAME_TITLE = 'Private Aggregation API Test'
const PRIVATE_AGGREGATION_TEST_SCRIPT_URL = 'https://shared-storage-demo-content-producer.web.app/paa/scripts/private-aggregation-test.html';

function setupIframe() {
  const body = document.querySelector('body');
  const iframe = document.createElement('iframe');

  iframe.style.height = 0;
  iframe.style.width = 0;
  iframe.style.top = 0;
  iframe.style.position = 'absolute';
  iframe.title = PRIVATE_AGGREGATION_TEST_IFRAME_TITLE;
  iframe.src = PRIVATE_AGGREGATION_TEST_SCRIPT_URL;

  body.appendChild(iframe);
}

try {
  setupIframe();
} catch {
  // Swallow the error
}
