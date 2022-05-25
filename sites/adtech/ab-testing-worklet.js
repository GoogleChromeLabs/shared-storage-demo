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
    const { experiments } = data;
    const experimentGroup = await this.sharedStorage.get('ab-testing-group');

    console.log(`urls = ${JSON.stringify(urls)}`);
    console.log(`data = ${JSON.stringify(data)}`);
    console.log(`ab-testing-group in shared storage is ${experimentGroup}`);

    const index = experiments.indexOf(experimentGroup);
    console.log('!!!', index);
    return experiments.indexOf(experimentGroup) || 0;
  }
}

register('ab-testing', SelectURLOperation);
