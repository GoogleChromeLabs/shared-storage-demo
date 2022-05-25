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

const adtechUrl = window.location.host;
const ADS = [
  `https://${adtechUrl}/ads/default-ad.html`,
  `https://${adtechUrl}/ads/experiment-ad-a.html`,
  `https://${adtechUrl}/ads/experiment-ad-b.html`,
];

const EXPERIMENTS = ['control', 'experiment-a', 'experiment-b'];

function getRandomIndex() {
  return Math.floor(Math.random() * EXPERIMENTS.length);
}

function getExperimentSeed() {
  return EXPERIMENTS[getRandomIndex()];
}

async function injectAd() {
  await window.sharedStorage.worklet.addModule('ab-testing-worklet.js');

  window.sharedStorage.set('ab-testing-group', getExperimentSeed(), {
    ignoreIfPresent: true,
  });

  const opaqueURL = await window.sharedStorage.selectURL('ab-testing', ADS, {
    data: {
      experiments: EXPERIMENTS,
    },
  });

  document.getElementById('ad-slot').src = opaqueURL;
}

injectAd();
