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

// This code is loaded as a Shared Storage worklet
class SelectURLOperation {
  async run(urls, data) {
    // Read the user's group from shared storage
    const experimentGroup = await this.sharedStorage.get('ab-testing-group');

    // Log to console for the demo
    console.log(`urls = ${JSON.stringify(urls)}`);
    console.log(`data = ${JSON.stringify(data)}`);
    console.log(`ab-testing-group in shared storage is ${experimentGroup}`);

    // Return the index of the group
    return data.indexOf(experimentGroup);
  }
}

// Register the operation as 'ab-testing'
register('ab-testing', SelectURLOperation);
