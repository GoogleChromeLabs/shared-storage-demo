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
 * adCampignId | ageGroupId | continentId
 * 
 * For example, a user from Australia between the age of 40-64, who has seen the 
 * ad campaign 321 will be represented by the key: 
 * 321 | 2 | 4 or 32124
 */
function generateAggregationKey(adCampaignId, ageGroup, continent) {
  console.log(`[PAA] Ad campaign ID is ${adCampaignId}`);

  const ageGroupId = AGGREGATION_KEY_MAP.ageGroupId[ageGroup]
  console.log(`[PAA] Age group is ${ageGroup}, and the corresponding ID is ${ageGroupId}`);

  const continentId = AGGREGATION_KEY_MAP.continentId[continent]
  console.log(`[PAA] Continent is ${continent}, and the corresponding ID is ${continentId}`);

  const aggregationKey = parseInt(`${adCampaignId}${ageGroupId}${continentId}`);
  console.log(`[PAA] The generated aggregation key is ${aggregationKey} which is composed of "${adCampaignId} | ${ageGroupId} | ${continentId}"`);

  return aggregationKey
}

class DemographicsMeasurementOperation {
  async run(data) {
    try {
      // const hasSubmittedReport = await this.sharedStorage.get('has-submitted-report');
      const ageGroup = await this.sharedStorage.get('age-group')
      const continent = await this.sharedStorage.get('continent')

      if (!ageGroup || !continent) {
        console.log('[PAA] Demographics data is missing. Please visit the survey data to enter your data.')
        return;
      }

      privateAggregation.enableDebugMode({ debug_key: 888 });
      privateAggregation.sendHistogramReport({
        bucket: generateAggregationKey(data.adCampaignId, ageGroup, continent),
        value: 128,
      });

      // await this.sharedStorage.set('has-submitted-report', true);
    } catch (e) {
      console.log(e);
    }
  }
}

// Register the operation as 'frequency-cap'
register('demographics-measurement', DemographicsMeasurementOperation);
