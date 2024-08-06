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
const contentProducerUrl = window.getContentProducerUrl();

// Ad confg with the URL of the ad, a probability weight for rotation, and the clickthrough rate.
const DEMO_AD_CONFIG = [
  {
    url: `${contentProducerUrl}/ads/ad-1.html`,
    weight: 0.7,
  },
  {
    url: `${contentProducerUrl}/ads/ad-2.html`,
    weight: 0.2,
  },
  {
    url: `${contentProducerUrl}/ads/ad-3.html`,
    weight: 0.1,
  },
];

async function setRotationMode(rotationMode) {
  // Load the worklet module
  const creativeRotationWorklet = await window.sharedStorage.createWorklet(
    `${contentProducerUrl}/url-selection/creative-rotation-worklet.js`,
    { dataOrigin: 'script-origin' }
  );

  await creativeRotationWorklet.run('set-rotation-mode', {
    data: { rotationMode }
  });
  console.log(`creative rotation mode set to ${rotationMode}`);
}

async function injectAd() {
  // Load the worklet module
  const creativeRotationWorklet = await window.sharedStorage.createWorklet(
    `${contentProducerUrl}/url-selection/creative-rotation-worklet.js`,
    { dataOrigin: 'script-origin' }
  );

  const urls = DEMO_AD_CONFIG.map(({ url }) => ({ url }));

  // Resolve the selectURL call to a fenced frame config only when it exists on the page
  const resolveToConfig = typeof window.FencedFrameConfig !== 'undefined';

  // Run the URL selection operation to determine the next ad that should be rendered
  const selectedUrl = await creativeRotationWorklet.selectURL('creative-rotation', urls, {
    data: DEMO_AD_CONFIG,
    resolveToConfig
  });

  const adSlot = document.getElementById('ad-slot');

  if (resolveToConfig && selectedUrl instanceof FencedFrameConfig) {
    adSlot.config = selectedUrl;
  } else {
    adSlot.src = selectedUrl;
  }
}

injectAd();
