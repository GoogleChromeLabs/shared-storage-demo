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

const FREQUENCY_LIMIT = 5;

class CreativeSelectionByFrequencyOperation {
  async run(urls, data) {
    // Read the current frequency cap in shared storage
    const count = parseInt(await sharedStorage.get('frequency-count'));

    // Log to console for the demo
    console.log(`urls = ${JSON.stringify(urls)}`);
    console.log(`frequency-count in shared storage is ${count}`);

    // If the count is 0, the frequency cap has been reached
    if (count === FREQUENCY_LIMIT) {
      console.log('frequency limit has been reached, and the default ad will be rendered');
      return 0;
    }

    // Increment the frequency
    await sharedStorage.set('frequency-count', count + 1);
    return 1;
  }
}

// Register the operation
register('creative-selection-by-frequency', CreativeSelectionByFrequencyOperation);
