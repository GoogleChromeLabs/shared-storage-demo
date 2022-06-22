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

// For demo purposes. The hostname is used to determine the usage of 
// development localhost URL vs production URL
const advertiserUrl = window.location.host;

// The first URL is the "register" button to be rendered if the user is not known
const AD_URLS = [
  { url: `https://${advertiserUrl}/ads/register-button.html` },
  { url: `https://${advertiserUrl}/ads/buy-now-button.html` },
];

async function injectAd() {
  // Load the worklet module
  await window.sharedStorage.worklet.addModule('known-customer-worklet.js');

  // Set the initial status to unknown ('0' is unknown and '1' is known)
  window.sharedStorage.set('known-customer', 0, {
    ignoreIfPresent: true,
  });

  // Run the URL selection operation to choose the button based on the user status
  const opaqueURL = await window.sharedStorage.selectURL('known-customer', AD_URLS);

  // Render the opaque URL into a fenced frame
  document.getElementById('button-slot').src = opaqueURL;
}

injectAd();
