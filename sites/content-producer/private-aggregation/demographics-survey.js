const form = document.querySelector('.demo__survey-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const ageGroup = form.querySelector('[name=age-group]:checked').value;
  const continent = form.querySelector('[name=continent]:checked').value;

  await window.sharedStorage.set('age-group', ageGroup);
  await window.sharedStorage.set('continent', continent);

  console.log('The following information has been set in Shared Storage:');
  console.log(`ageGroup = ${ageGroup}`);
  console.log(`continent = ${continent}`);
  console.log('Visit the publisher page to continue the demo.');

  const submitButtonEl = form.querySelector('.demo__submit-button');
  const publisherLinkButtonEl = form.querySelector('.demo__continue-button');
  submitButtonEl.style.display = 'none';
  publisherLinkButtonEl.style.display = 'initial';
});
