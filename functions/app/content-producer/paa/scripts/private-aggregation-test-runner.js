async function runPrivateAggregationTest(siteId, debugKey) {
  console.log('! runPrivateAggregationTest');
  window.sharedStorage.set('test-value', '1');
  window.sharedStorage.set('debug-key', debugKey, { ignoreIfPresent: true });
  window.sharedStorage.set(`has-visited-${siteId}`, '1');

  await window.sharedStorage.worklet.addModule(
    `https://localhost:4437/paa/scripts/private-aggregation-test-worklet.js`
  );

  window.sharedStorage.run('private-aggregation-test', {
    data: {
      debug_key: debugKey,
    },
  });
}

try {
  if ('sharedStorage' in window) {
    runPrivateAggregationTest();
  }
} catch {}

console.log('! private-aggregation-test-runner');
