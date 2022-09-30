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

class ReachMeasurementOperation {
  async run(data) {
    try {
      const { textContent } = data
      console.log('123', textContent)
      // const statusEl = document.querySelector('.demo__report-status');
      const key = 'has-seen-ad-campaign';
      const hasSeenAd = await this.sharedStorage.get(key) === 'true';

      if (hasSeenAd) {
        const statusText = `Unique reach measurement report has been submitted already for ad campaign ${data.adCampaignId}`
        textContent = statusText
        console.log(statusText);

        return;
      }

      privateAggregation.enableDebugMode({ debug_key: 777 });
      privateAggregation.sendHistogramReport({
        bucket: convertCampaignIdToBucket(data.adCampaignId),
        value: 128,
      });

      await this.sharedStorage.set(key, true);

      console.log(`[PAA] Unique reach measurement report will be submitted for ad campaign ${data.adCampaignId}`);
    } catch (e) {
      console.log(e);
    }
  }
}

// Register the operation as 'frequency-cap'
register('reach-measurement', ReachMeasurementOperation);
