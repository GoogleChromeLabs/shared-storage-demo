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

// Placeholder for 8-bits to be used for padding
const ZEROES_FOR_PADDING = '00000000';

function renderOutput({ decodedBucket, decodedValue }) {
  document.querySelector('.decoder__bucket--binary').innerHTML = decodedBucket;
  document.querySelector('.decoder__bucket--decimal').innerHTML = BigInt(parseInt(decodedBucket, 2));
  document.querySelector('.decoder__value--binary').innerHTML = decodedValue;
  document.querySelector('.decoder__value--decimal').innerHTML = BigInt(parseInt(decodedValue, 2));
}

function decode(input) {
  return input
    .reduce((acc, n) => [...acc, n.toString(2)], [])
    .filter((n) => n != '0')
    .map((n) => ZEROES_FOR_PADDING.slice(0, 8 - n.length) + n)
    .join('');
}

async function decodePayload(payload) {
  const buffer = new Uint8Array([...atob(payload)].map((c) => c.charCodeAt(0)));
  const {
    data: [{ bucket, value }],
  } = await cbor.decodeFirst(buffer);

  return {
    decodedBucket: decode(bucket),
    decodedValue: decode(value),
  };
}

async function runDecoder() {
  const payload = document.querySelector('.decoder__input').value;

  if (!payload) {
    return;
  }

  const output = await decodePayload(payload);
  renderOutput(output);
}
