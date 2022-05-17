console.log('worklet!!!');

class SelectURLOperation {
  async run(urls, data) {
    const storedCount = await this.sharedStorage.get('frequency-cap-count');
    const count = parseInt(storedCount, 10)
    console.log(`frequency-cap-count in shared storage is ${count}`)

    if (!count) {
      console.log('!!! capped !!!')
      return 0
    }

    await this.sharedStorage.set('frequency-cap-count', (count - 1).toString())

    return 1;
  }
}

registerURLSelectionOperation('frequency-cap', SelectURLOperation);
