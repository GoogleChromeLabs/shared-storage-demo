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

// Map the experiment groups to the URLs
const EXPERIMENT_MAP = [
  {
    group: 'control',
    url: `https://${advertiserUrl}/ads/default-ad.html`,
  },
  {
    group: 'experiment-a',
    url: `https://${advertiserUrl}/ads/experiment-ad-a.html`,
  },
  {
    group: 'experiment-b',
    url: `https://${advertiserUrl}/ads/experiment-ad-b.html`,
  },
];

// Choose a random group for the initial experiment
function getRandomExperiment() {
  const randomIndex = Math.floor(Math.random() * EXPERIMENT_MAP.length);
  return EXPERIMENT_MAP[randomIndex].group;
}

async function injectAd() {
  // Load the worklet module
  await window.sharedStorage.worklet.addModule('ab-testing-worklet.js');

  // Set the initial value in the storage to o a random experiment group
  window.sharedStorage.set('ab-testing-group', getRandomExperiment(), {
    ignoreIfPresent: true,
  });

  // Run the URL selection operation to select an ad based on the experiment group in shared storage
  const urls = EXPERIMENT_MAP.map(({ url }) => url);
  const groups = EXPERIMENT_MAP.map(({ group }) => group);
  const opaqueURL = await window.sharedStorage.selectURL('ab-testing', urls, { data: groups });

  // Render the opaque URL into a fenced frame
  document.getElementById('ad-slot').src = opaqueURL;
}

injectAd();
