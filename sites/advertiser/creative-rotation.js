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

// The hostname is used to determine the usage of development localhost URL vs production URL
const advertiserUrl = window.location.host;

// Ad confg with the URL of the ad, a probability weight for rotation, and the clickthrough rate.
const DEMO_AD_CONFIG = [
  {
    url: `https://${advertiserUrl}/ads/ad-1.html`,
    weight: 0.7,
    clickThroughRate: 0.06,
  },
  {
    url: `https://${advertiserUrl}/ads/ad-2.html`,
    weight: 0.2,
    clickThroughRate: 0.02,
  },
  {
    url: `https://${advertiserUrl}/ads/ad-3.html`,
    weight: 0.1,
    clickThroughRate: 0.09,
  },
];

// Set the mode to sequential and set the starting index to 0.
async function seedStorage() {
  await window.sharedStorage.set('creative-rotation-mode', 'sequential', {
    ignoreIfPresent: true,
  });

  await window.sharedStorage.set('creative-rotation-index', 0, {
    ignoreIfPresent: true,
  });
}

async function injectAd() {
  // Load the worklet module
  await window.sharedStorage.worklet.addModule('creative-rotation-worklet.js');

  // Initially set the storage to sequential mode for the demo
  seedStorage();

  // Run the URL selection operation to determine the next ad that should be rendered
  const adUrls = DEMO_AD_CONFIG.map(({ url }) => url);
  const opaqueURL = await window.sharedStorage.selectURL('creative-rotation', adUrls, { data: DEMO_AD_CONFIG });

  // Render the opaque URL into a fenced frame
  document.getElementById('ad-slot').src = opaqueURL;
}

injectAd();
