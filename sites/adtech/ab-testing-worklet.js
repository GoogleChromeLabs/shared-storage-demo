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
