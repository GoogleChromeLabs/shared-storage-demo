class SelectURLOperation {
  async run(urls, data) {
    const storedCount = await this.sharedStorage.get('frequency-cap-count');
    const count = parseInt(storedCount, 10)

    console.log(`urls = ${JSON.stringify(urls)}`)
    console.log(`data = ${JSON.stringify(data)}`)
    console.log(`frequency-cap-count in shared storage is ${count}`)

    if (!count) {
      console.log('!!! capped !!!')
      return 0
    }

    await this.sharedStorage.set('frequency-cap-count', (count - 1).toString())

    return 1;
  }
}

register('frequency-cap', SelectURLOperation);
