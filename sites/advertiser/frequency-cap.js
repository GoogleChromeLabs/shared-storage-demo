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

const AD_URLS = [
  { url: `https://localhost:4437/ads/default-ad.html` },
  { url: `https://localhost:4437/ads/example-ad.html` },
];

async function injectAd() {
  // Load the worklet module
  await window.sharedStorage.worklet.addModule('frequency-cap-worklet.js');

  // Set the initial frequency cap to 5
  window.sharedStorage.set('frequency-cap-count', 5, {
    ignoreIfPresent: true,
  });

  // Run the URL selection operation to choose an ad based on the frequency cap in shared storage
  const opaqueURL = await window.sharedStorage.selectURL('frequency-cap', AD_URLS);

  // Render the opaque URL into a fenced frame
  document.getElementById('ad-slot').src = opaqueURL;
}

injectAd();
