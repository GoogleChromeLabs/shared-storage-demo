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

async function injectAd() {
  const adtechUrl = window.location.host;
  const ads = [`https://${adtechUrl}/ads/default-ad.html`, `https://${adtechUrl}/ads/example-ad.html`];

  await window.sharedStorage.worklet.addModule('frequency-cap-worklet.js');
  window.sharedStorage.set('frequency-cap-count', '5', {
    ignoreIfPresent: true,
  });

  const opaqueURL = await window.sharedStorage.selectURL('frequency-cap', ads, {
    data: { foo: 'bar' },
  });

  document.getElementById('ad-slot').src = opaqueURL;
}

injectAd();
