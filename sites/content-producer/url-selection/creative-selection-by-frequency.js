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
const contentProducerUrl = window.location.host;

const AD_URLS = [
  { url: `https://${contentProducerUrl}/ads/default-ad.html` },
  { url: `https://${contentProducerUrl}/ads/example-ad.html` },
];

async function injectAd() {
  // Load the worklet module
  await window.sharedStorage.worklet.addModule('creative-selection-by-frequency-worklet.js');

  // Set the initial frequency cap to 5
  window.sharedStorage.set('frequency-count', 0, {
    ignoreIfPresent: true,
  });

  // Resolve the selectURL call to a fenced frame config only when it exists on the page
  const resolveToConfig = typeof window.FencedFrameConfig !== 'undefined';

  // Run the URL selection operation to choose an ad based on the frequency cap in shared storage
  const selectedUrl = await window.sharedStorage.selectURL('creative-selection-by-frequency', AD_URLS, {
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
