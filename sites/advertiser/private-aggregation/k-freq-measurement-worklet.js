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

/**
 * The scale factor is multiplied by the aggregatable value to maximize
 * the signal-to-noise ratio. See “Noise and scaling” section in the
 * Aggregation Fundamentals document to learn more:
 * - https://developer.chrome.com/en/docs/privacy-sandbox/aggregation-fundamentals
 */
const SCALE_FACTOR = 65536;

/**
 * The bucket key must be a number, and in this case, it is simply the content
 * ID itself. For more complex buckey key construction, see other use cases in
 * this demo.
 */
function convertContentIdToBucket(contentId) {
  return BigInt(contentId);
}

class KFreqMeasurementOperation {
  async run(data) {
    try {
      const { kFreq, contentId, debug_key } = data;

      // Read from Shared Storage
      const hasReportedContentKey = 'has-reported-content';
      const impressionCountKey = 'impression-count';
      const hasReportedContent = (await this.sharedStorage.get(hasReportedContentKey)) === 'true';
      const impressionCount = parseInt(await this.sharedStorage.get(impressionCountKey));

      // Do not report if a report has been sent already
      if (hasReportedContent) {
        console.log(
          `[PAA] K-frequency report has been submitted already for Content ID ${contentId}. Reset the demo to start over.`
        );
        return;
      }

      // Check ipmression count against frequency limit 
      if (impressionCount < kFreq) {
        console.log(
          `[PAA] Current impression count is ${impressionCount} and has not met the K threashold of ${kFreq}`
        );
        await this.sharedStorage.set(impressionCountKey, impressionCount + 1);
        return;
      }

      // Generate the aggregation key and the aggregatable value
      const bucket = convertContentIdToBucket(contentId);
      const value = 1 * SCALE_FACTOR;

      // Send an aggregatable report via the Private Aggregation API
      privateAggregation.enableDebugMode({ debug_key });
      privateAggregation.sendHistogramReport({ bucket, value });

      // Set the report submission status flag
      await this.sharedStorage.set(hasReportedContentKey, 'true');

      console.log(`[PAA] Current impression count is ${impressionCount} which meets the K threashold of ${kFreq}`);
      console.log('[PAA] K-frequency measurement report will be submitted');
      console.log(`[PAA] The aggregation key is ${bucket} and the aggregatable value is ${value}`);
    } catch (e) {
      console.log(e);
    }
  }
}

// Register the operation
register('k-freq-measurement', KFreqMeasurementOperation);
