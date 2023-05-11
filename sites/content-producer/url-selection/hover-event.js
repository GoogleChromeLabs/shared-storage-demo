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
const CONTENT_ID = 1234;
const contentProducerUrl = window.location.host;
const AD_URLS = [
  { 
    url: `https://${contentProducerUrl}/ads/hover-ad.html`,
    reportingMetadata: {
      hover: `https://${contentProducerUrl}/report/hover?contentId=${CONTENT_ID}`
    }
  }
];

async function injectAd() {
  // Load the worklet module
  await window.sharedStorage.worklet.addModule('hover-event-worklet.js');

  // Resolve the selectURL call to a fenced frame config only when it exists on the page
  const resolveToConfig = typeof window.FencedFrameConfig !== 'undefined';

  // Run the URL selection operation to select an ad based on the experiment group in shared storage
  const selectedUrl = await window.sharedStorage.selectURL('hover-event', AD_URLS, {
    resolveToConfig,
  });

  const adSlot = document.getElementById('ad-slot');

  if (resolveToConfig && selectedUrl instanceof FencedFrameConfig) {
    adSlot.config = selectedUrl;
  } else {
    adSlot.src = selectedUrl;
  }
}

injectAd();
