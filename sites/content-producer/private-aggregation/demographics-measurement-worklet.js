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
 * ID itself. For more complex buckey key construction, see other use cases in
 * this demo.
 */
const AGGREGATION_KEY_MAP = {
  ageGroupId: {
    '18-39': '1',
    '40-64': '2',
    '65+': '3',
  },
  continentId: {
    africa: '1',
    antarctica: '2',
    asia: '3',
    australia: '4',
    europe: '5',
    'north-america': '6',
    'south-america': '7',
  },
};

/**
 * The aggregation key will be in the format of:
 * contentId | ageGroupId | continentId
 *
 * For example, a user from Australia between the age of 40-64, who has
 * seen the Content ID 321 will be represented by the key:
 * 321 | 2 | 4 or 32124
 */
function generateAggregationKey(contentId, ageGroup, continent) {
  const ageGroupId = AGGREGATION_KEY_MAP.ageGroupId[ageGroup];
  const continentId = AGGREGATION_KEY_MAP.continentId[continent];
  const aggregationKey = BigInt(`${contentId}${ageGroupId}${continentId}`);

  console.log(`[PAA] Content ID is ${contentId}`);
  console.log(`[PAA] Continent is ${continent}, and the corresponding ID is ${continentId}`);
  console.log(`[PAA] Age group is ${ageGroup}, and the corresponding ID is ${ageGroupId}`);
  console.log(
    `[PAA] The generated aggregation key is ${aggregationKey} which is composed of "${contentId} | ${ageGroupId} | ${continentId}"`
  );

  return aggregationKey;
}

class DemographicsMeasurementOperation {
  async run(data) {
    try {
      const { contentId, debugKey } = data;

      // Read from Shared Storage
      const key = 'has-reported-content';
      const hasReportedContent = (await sharedStorage.get(key)) === 'true';
      const ageGroup = await sharedStorage.get('age-group');
      const continent = await sharedStorage.get('continent');

      // Do not report if a report has been sent already
      if (hasReportedContent) {
        console.log(
          `[PAA] Demographics measurement report has been submitted already for Content ID ${contentId}. Reset the demo to start over.`
        );
        return;
      }

      if (!ageGroup || !continent) {
        console.log('[PAA] Demographics data is missing. Visit the survey data to enter your data.');
        return;
      }

      // Generate the aggregation key and the aggregatable value
      const bucket = generateAggregationKey(data.contentId, ageGroup, continent);
      const value = 1 * SCALE_FACTOR;

      // Send an aggregatable report via the Private Aggregation API
      privateAggregation.enableDebugMode({ debugKey });
      privateAggregation.contributeToHistogram({ bucket, value });

      // Set the report submission status flag
      await sharedStorage.set(key, true);

      console.log(`[PAA] Unique reach measurement report will be submitted for Content ID ${data.contentId}`);
      console.log(`[PAA] The aggregation key is ${bucket} and the aggregatable value is ${value}`);
    } catch (e) {
      console.error(e);
    }
  }
}

// Register the operation
register('demographics-measurement', DemographicsMeasurementOperation);
