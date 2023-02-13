/**
 * The aggregation key is based on if the user visited DCC and/or WD.
 * If the user has visited DCC-only, the key is 0
 * If the user has visited WD-only, the key is 1
 * If the user has visited both sites, the key is 2
 */
function buildAggregationKey(hasVisitedDcc, hasVisitedWd) {
  // Only DCC
  if (hasVisitedDcc && !hasVisitedWd) return 0;

  // Only WD
  if (!hasVisitedDcc && hasVisitedWd) return 1;

  // Both DCC and WD
  if (hasVisitedDcc && hasVisitedWd) return 2;
}

class PrivateAggregationTest {
  async run(data) {
    const { debug_key } = data;

    const testValue = await this.sharedStorage.get('test-value');
    const hasVisitedDcc = await this.sharedStorage.get('has-visited-0')
    const hasVisitedWd = await this.sharedStorage.get('has-visited-1')

    privateAggregation.enableDebugMode({ debug_key });
    privateAggregation.sendHistogramReport({ 
      bucket: buildAggregationKey(hasVisitedDcc, hasVisitedWd),
      value: parseInt(testValue)
    });
  }
}

register('private-aggregation-test', PrivateAggregationTest);