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
 *
 * The scale factor used here has been intentionally reduced to an arbitrary number.
 * The maximum aggregatable value used in this demo is 1. The scale factor
 * of 65536 would have maximized the signal-to-noise ratio. However, that also
 * uses the entire contribution budget for the rolling 24-hour period.
 *
 * Therefore, the scale factor has been significantly reduced to allow the demo
 * to be used repeatedly for testing throughout without hitting the contribution
 * budget limit.
 */
const SCALE_FACTOR = 128;

/**
 * The bucket key must be a number, and in this case, it is simply the ad campaign
 * ID itself. For more complex buckey key construction, see other use cases in this demo.
 */
function convertContentIdToBucket(contentId) {
  return BigInt(contentId);
}

class ReachMeasurementOperation {
  async run(data) {
    try {
      const { contentId, debugKey } = data;

      // Read from Shared Storage
      const key = 'has-reported-content';
      const hasReportedContent = (await sharedStorage.get(key)) === 'true';

      // Do not report if a report has been sent already
      if (hasReportedContent) {
        console.log(
          `[PAA] Unique reach measurement report has been submitted already for Content ID ${data.contentId}. Reset the demo to start over.`
        );
        return;
      }

      // Generate the aggregation key and the aggregatable value
      const bucket = convertContentIdToBucket(contentId);
      const value = 1 * SCALE_FACTOR;

      // Send an aggregatable report via the Private Aggregation API
      privateAggregation.enableDebugMode({ debugKey });
      privateAggregation.contributeToHistogram({ bucket, value });

      // Set the report submission status flag
      await sharedStorage.set(key, true);

      console.log(`[PAA] Unique reach measurement report will be submitted for Content ID ${contentId}`);
      console.log(`[PAA] The aggregation key is ${bucket} and the aggregatable value is ${value}`);
    } catch (e) {
      console.log(e);
    }
  }
}

// Register the operation
register('reach-measurement', ReachMeasurementOperation);
