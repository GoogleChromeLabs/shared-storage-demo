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
    const storedCount = await this.sharedStorage.get('frequency-cap-count');
    const count = parseInt(storedCount, 10);

    console.log(`urls = ${JSON.stringify(urls)}`);
    console.log(`data = ${JSON.stringify(data)}`);
    console.log(`frequency-cap-count in shared storage is ${count}`);

    if (!count) {
      console.log('!!! capped !!!');
      return 0;
    }

    await this.sharedStorage.set('frequency-cap-count', (count - 1).toString());

    return 1;
  }
}

register('frequency-cap', SelectURLOperation);
