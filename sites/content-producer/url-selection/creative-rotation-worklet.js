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
    // Initially set the storage to sequential mode for the demo
    await SelectURLOperation.seedStorage();

    // Read the rotation mode from Shared Storage
    const rotationMode = await sharedStorage.get('creative-rotation-mode');

    // Generate a random number to be used for rotation
    const randomNumber = Math.random();

    let index;

    switch (rotationMode) {
      /**
       * Sequential rotation
       * - Rotates the creatives in order
       * - Example: A -> B -> C -> A ...
       */
      case 'sequential':
        const currentIndex = await sharedStorage.get('creative-rotation-index');
        index = parseInt(currentIndex, 10);
        const nextIndex = (index + 1) % urls.length;

        console.log(`index = ${index} / next index = ${nextIndex}`);

        await sharedStorage.set('creative-rotation-index', nextIndex.toString());
        break;

      /**
       * Evenly-distributed rotation
       * - Rotates the creatives with equal probability
       * - Example: A=33% / B=33% / C=33%
       */
      case 'even-distribution':
        index = Math.floor(randomNumber * urls.length);
        break;

      /**
       * Weighted rotation
       * - Rotates the creatives with weighted probability
       * - Example: A=70% / B=20% / C=10%
       */
      case 'weighted-distribution':
        console.log('data = ', JSON.stringify(data));
        // Find the first URL where the cumnulative sum of the weights
        // exceed the random number. The array is sorted by the weight
        // in descending order.
        let weightSum = 0;
        const { url } = data
          .sort((a, b) => b.weight - a.weight)
          .find(({ weight }) => {
            weightSum += weight;
            return weightSum > randomNumber;
          });

        index = urls.indexOf(url);
        break;

      default:
        index = 0;
    }

    console.log(JSON.stringify({ index, randomNumber, rotationMode }));
    return index;
  }

  // Set the mode to sequential and set the starting index to 0.
  static async seedStorage() {
    await sharedStorage.set('creative-rotation-mode', 'sequential', {
      ignoreIfPresent: true,
    });

    await sharedStorage.set('creative-rotation-index', 0, {
      ignoreIfPresent: true,
    });
  }
}

class SetRotationModeOperation {
  async run({ rotationMode }) {
    await sharedStorage.set('creative-rotation-mode', rotationMode);
  }
}

// Register the operation as 'creative-rotation'
register('creative-rotation', SelectURLOperation);
register('set-rotation-mode', SetRotationModeOperation);
