/**
 * Copyright 2023 Google LLC
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

const DEBUG_MODE_CHANCE = 0.5;

class PrivateAggregationTest {
  async run() {
    const testKey = await this.sharedStorage.get('test-key');
    const testValue = await this.sharedStorage.get('test-value');

    if (Math.random() < DEBUG_MODE_CHANCE) {
      // The debug key is a random 15 or 16 digit integer
      const debug_key = BigInt(Math.round(Math.random() * 1e16));
      privateAggregation.enableDebugMode({ debug_key });
    }

    privateAggregation.sendHistogramReport({
      bucket: BigInt(testKey),
      value: parseInt(testValue),
    });
  }
}

register('private-aggregation-test', PrivateAggregationTest);
