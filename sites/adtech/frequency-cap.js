async function injectAd() {
  const adtechUrl = window.location.host
  const ads = [
    `https://${adtechUrl}/ads/default-ad.html`,
    `https://${adtechUrl}/ads/example-ad.html`,
  ]

  await window.sharedStorage.worklet.addModule('frequency-cap-worklet.js');
  window.sharedStorage.set('frequency-cap-count', '5', { ignoreIfPresent: true });

  const opaqueURL = await window.sharedStorage.selectURL(
    'frequency-cap',
    ads,
    { data: { foo: 'bar' } }
  );

  document.getElementById('ad-fenced-frame').src = opaqueURL;
}

injectAd()
