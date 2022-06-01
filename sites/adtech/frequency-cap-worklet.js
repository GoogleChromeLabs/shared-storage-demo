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

class SelectURLOperation {
  async run(urls, data) {
    // Read the current frequency cap in shared storage
    const count = await this.sharedStorage.get('frequency-cap-count');

    // Log to console for the demo
    console.log(`urls = ${JSON.stringify(urls)}`);
    console.log(`frequency-cap-count in shared storage is ${count}`);

    // If the count is 0, the frequency cap has been reached
    if (!count) {
      console.log('frequency cap has been reached, and the default ad will be rendered');
      return 0;
    }

    // Set the new frequency count in shared storage
    await this.sharedStorage.set('frequency-cap-count', (count - 1).toString());
    return 1;
  }
}

// Register the operation as 'frequency-cap'
register('frequency-cap', SelectURLOperation);
