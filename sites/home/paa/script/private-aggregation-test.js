async function runPrivateAggregationTest() {
  window.sharedStorage.set('test-key', '123', { ignoreIfPresent: true, });
  window.sharedStorage.set('test-value', '1', { ignoreIfPresent: true, });

  await window.sharedStorage.worklet.addModule('private-aggregation-test.js');
  window.sharedStorage.run('private-aggregation-test');
}

if ('sharedStorage' in window) {
  runPrivateAggregationTest();
}
