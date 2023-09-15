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

function renderOutput({ bucketInBinary, valueInBinary }) {
  document.querySelector('.decoder__bucket--binary').innerHTML = bucketInBinary;
  document.querySelector('.decoder__bucket--decimal').innerHTML = BigInt(`0b${bucketInBinary}`);
  document.querySelector('.decoder__value--binary').innerHTML = valueInBinary;
  document.querySelector('.decoder__value--decimal').innerHTML = BigInt(`0b${valueInBinary}`);
}

// Converts the number to a binary string
function covertToBinary(input) {
  return input
    // Filter out 0s 
    .filter((n) => n)
    // Converts number to binary, and moves it to an array from a typed array to an array
    .reduce((acc, n) => [...acc, n.toString(2)], [])
    // Pad the left of the value and make it a length of 8
    .map((n) => ZEROES_FOR_PADDING.slice(0, 8 - n.length) + n)
    .join('');
}

async function decodePayload(payload) {
  // Base64 decode
  const arr = new Uint8Array([...atob(payload)]
    .map((c) => c.charCodeAt(0)));

  // CBOR decode
  const {
    data: [{ bucket, value }],
  } = await cbor.decodeFirst(arr);

  return {
    bucketInBinary: covertToBinary(bucket),
    valueInBinary: covertToBinary(value),
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
