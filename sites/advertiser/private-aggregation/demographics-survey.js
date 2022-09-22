function setDemographics(ageGroup, continent) {
  window.sharedStorage.set('age-group', ageGroup)
  window.sharedStorage.set('continent', continent)
}

const form = document.querySelector('.demo__survey-form')

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const ageGroup = form.querySelector('[name=age-group]:checked').value;
  const continent = form.querySelector('[name=continent]:checked').value;

  console.log({ ageGroup, continent }) 

  setDemographics(ageGroup, continent)
})
