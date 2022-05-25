const adtechUrl = window.location.host;
const ADS = [
  `https://${adtechUrl}/ads/default-ad.html`,
  `https://${adtechUrl}/ads/experiment-ad-a.html`,
  `https://${adtechUrl}/ads/experiment-ad-b.html`,
];

const EXPERIMENTS = ['control', 'experiment-a', 'experiment-b'];

function getRandomIndex() {
  return Math.floor(Math.random() * EXPERIMENTS.length);
}

function getExperimentSeed() {
  return EXPERIMENTS[getRandomIndex()];
}

async function injectAd() {
  await window.sharedStorage.worklet.addModule('ab-testing-worklet.js');

  window.sharedStorage.set('ab-testing-group', getExperimentSeed(), {
    ignoreIfPresent: true,
  });

  const opaqueURL = await window.sharedStorage.selectURL('ab-testing', ADS, {
    data: {
      experiments: EXPERIMENTS,
    },
  });

  document.getElementById('ad-slot').src = opaqueURL;
}

injectAd();
