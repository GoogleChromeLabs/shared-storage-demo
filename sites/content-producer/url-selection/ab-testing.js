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

// Map the experiment groups to the URLs
const EXPERIMENT_MAP = [
  {
    group: 'control',
    url: `https://${contentProducerUrl}/ads/default-ad.html`,
  },
  {
    group: 'experiment-a',
    url: `https://${contentProducerUrl}/ads/experiment-ad-a.html`,
  },
  {
    group: 'experiment-b',
    url: `https://${contentProducerUrl}/ads/experiment-ad-b.html`,
  },
];

// Choose a random group for the initial experiment
function getRandomExperiment() {
  const randomIndex = Math.floor(Math.random() * EXPERIMENT_MAP.length);
  return EXPERIMENT_MAP[randomIndex].group;
}

async function injectAd() {
  // Load the worklet module
  const abTestingWorklet = await window.sharedStorage.createWorklet(
    'ab-testing-worklet.js'
  );

  // Set the initial value in the storage to a random experiment group
  window.sharedStorage.set('ab-testing-group', getRandomExperiment(), {
    ignoreIfPresent: true,
  });

  const urls = EXPERIMENT_MAP.map(({ url }) => ({ url }));
  const groups = EXPERIMENT_MAP.map(({ group }) => group);

  // Resolve the selectURL call to a fenced frame config only when it exists on the page
  const resolveToConfig = typeof window.FencedFrameConfig !== 'undefined';

  // Run the URL selection operation to select an ad based on the experiment group in shared storage
  const selectedUrl = await abTestingWorklet.selectURL('ab-testing', urls, {
    data: groups,
    resolveToConfig,
    keepAlive: true,
  });

  const adSlot = document.getElementById('ad-slot');

  if (resolveToConfig && selectedUrl instanceof FencedFrameConfig) {
    adSlot.config = selectedUrl;
  } else {
    adSlot.src = selectedUrl;
  }

  // Run the reporting operation
  await abTestingWorklet.run('experiment-group-reporting')
}

injectAd();
