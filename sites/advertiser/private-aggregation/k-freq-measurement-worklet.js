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
 * The bucket key must be a number, and in this case, it is simply the ad campaign
 * ID itself. For more complex buckey key construction, see other use cases in
 * this demo.
 */
function convertCampaignIdToBucket(adCampaignId) {
  return parseInt(adCampaignId);
}

class KFreqMeasurementOperation {
  async run(data) {
    try {
      const { kFreq, adCampaignId } = data;
      const hasSubmittedReportKey = 'has-submitted-report';
      const impressionCountKey = 'impression-count';
      const hasSubmittedReport = await this.sharedStorage.get(hasSubmittedReportKey) === 'true'
      const impressionCount = parseInt(await this.sharedStorage.get(impressionCountKey))

      if (hasSubmittedReport) {
        console.log('[PAA] K-frequency report has been submitted already')
        return;
      }

      if (impressionCount < kFreq) {
        console.log(`[PAA] Current impression count is ${impressionCount} and has not met the K threashold of ${kFreq}`)
        await this.sharedStorage.set(impressionCountKey, impressionCount + 1);
        return;
      }

      privateAggregation.enableDebugMode({ debug_key: 999 });
      privateAggregation.sendHistogramReport({
        bucket: convertCampaignIdToBucket(adCampaignId),
        value: 128, // A predetermined fixed value; see Private Aggregation API explainer: Scaling values.
      });

      console.log(`[PAA] Current impression count is ${impressionCount} which meets the K threashold of ${kFreq}`)
      console.log('[PAA] K-frequency measurement report has been submitted')
      await this.sharedStorage.set(hasSubmittedReportKey, 'true');
    } catch (e) {
      console.log(e);
    }
  }
}

// Register the operation as 'frequency-cap'
register('k-freq-measurement', KFreqMeasurementOperation);
